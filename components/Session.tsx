'use client'
import { useState } from 'react'
import Markdown from 'react-markdown'
import UserInput from './UserInput'
import { v4 as uuidv4 } from 'uuid';


export default function Session() {
    const [messages, setMessages] = useState<any[]>([]);
    const [mode, setMode] = useState<string>('chat');
    const [repo, setRepo] = useState<string>('');
    const [repoSelect, setRepoSelect] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>(uuidv4());

    const handleModeSwitch = async () => {
        if(mode == 'chat') {
            if(repo == '') {
                window.alert("WARNING: Set the path to your repository!!!")
            } else {
                setMode('optimize');
                const newSessionId = uuidv4();
                setSessionId(newSessionId);
                const params = new URLSearchParams({
                    repo_path: repo,
                    session_id: newSessionId,
                })
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/optimize?${params.toString()}`, {method: 'POST'});
                const response = await res.json();
                setMessages([response]);
            }
        } else {
            setMode('chat')
            setMessages([]);
        }
    }

    const handleKeyUp = async(e: any) => {
        if(e.key == 'Enter' && repo != '') {
            const question = e.target.value;
            const params = new URLSearchParams({
                question: question , 
                repo_path: repo,
                session_id: sessionId,
            })
            setMessages((prevMessages: any[]) => {return [...prevMessages, {message :question }]});
            e.target.value = '';
            var res;
            if(mode == 'chat') {
                res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/query?${params.toString()}`)
            } else {
                res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/optimize?${params.toString()}`, {method: 'POST'});
            }
            const response = await res.json();
            setMessages((prevMessages: any[]) => {return [...prevMessages, response]});
        }
    }

    const handleRepoInput = async(e: any) => {
        if(e.key == 'Enter') {
            setRepo(e.target.value);
            setRepoSelect(!repoSelect);
            setSessionId(uuidv4());
        }
    }   
    
    const handleCodeChange = async() => {
        const params = new URLSearchParams({
            repo_path: repo,
            session_id: sessionId,
        })
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/reject?${params.toString()}`, {method: 'POST'});
    }

    return (
        <div className='w-4/5 h-screen'>
            <div className='w-full flex justify-center p-2'>
                <button onClick={handleModeSwitch} className={`relative inline-flex m-2  h-fit w-15 items-center rounded-full transition ${mode == 'chat' ? 'bg-gray-400' : 'bg-blue-600'}`}>
                    <div className={`z-50 inline-block h-6 w-6 transform rounded-full bg-white transition ${mode == 'chat' ? 'translate-x-9' : 'translate-x-0'}`} />
                </button>
                <span className={`m-2 w-50 ${mode == 'chat' ? 'text-gray-400' : 'text-blue-600'}`}>{`Mode: ${mode == 'chat' ? 'Chat' : 'Code Optimization'}`}</span>
            </div>
            <div className='flex flex-col h-[80vh] w-full overflow-y-scroll'>
            {messages.map((msg: any, index) => {
                if('response' in msg) {
                    if(mode == 'chat') {
                        return <div key={index} className='w-fit h-fit flex-col p-3 m-5 text-left'>
                        {<Markdown>{msg.response}</Markdown>}
                        </div>
                    } else {
                        return <div key={index} className='w-fit h-fit flex-col p-3 m-5 text-left'>
                        {<Markdown>{msg.response}</Markdown>}
                            <div>
                                <button className='m-2'>✅ <span className='text-xs hover:text-blue-600'>Keep the changes</span></button>
                                <button onClick={() =>handleCodeChange()} className='m-2'>❌ <span className='text-xs hover:text-blue-600'>Discard the changes</span></button>
                            </div>
                        </div>
                    }
                } else {
                return <div key={index} className='flex self-end p-3 m-5 bg-blue-100 rounded-full w-fit'>
                  {msg.message}
                </div>
                }
            })}
            </div>
            <div className="relative w-4/5 p-1.5 rounded-xl border border-gray-300 flex justify-center">
                {repoSelect && (
                    <div className='absolute -top-11 -left-1 bg-white border border-gray-300 shadow-lg p-2 rounded-lg z-50'>
                        <input className='w-40xl m-1.5 focus:border-transparent focus:outline-none focus:ring-0' placeholder="Path to your codebase" onKeyUp={handleRepoInput}></input>
                    </div>
                )}
                <button className='text-2xl m-1.5 mr-2' onClick={() => setRepoSelect(!repoSelect)}>+</button>
                <input className="w-8/9 m-1.5 focus:border-transparent focus:outline-none focus:ring-0" placeholder="Ask about your codebase" onKeyUp={handleKeyUp}></input>
            </div>
        </div>
    )
}