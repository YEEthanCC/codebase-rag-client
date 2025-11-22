'use client'
import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid';
import { IoIosCloseCircle } from "react-icons/io";
import LoadingIndicator from './LoadingIndicator';


export default function Session() {
    const [messages, setMessages] = useState<any[]>([]);
    const [mode, setMode] = useState<string>('chat');
    const [repo, setRepo] = useState<string>('');
    const [repoSelect, setRepoSelect] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>(uuidv4());
    const [loading, setLoading] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleModeSwitch = async () => {
        if(loading) return;
        if(mode == 'chat') {
            if(repo == '') {
                window.alert("WARNING: Set the path to your repository!!!")
            } else {
                setMode('optimize');
                const newSessionId = uuidv4();
                setSessionId(newSessionId);
                setMessages([]);
                const params = new URLSearchParams({
                    repo_path: repo,
                    session_id: newSessionId,
                })
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/optimize?${params.toString()}`, {method: 'POST'});
                const response = await res.json();
                setLoading(false);
                setMessages([response]);
            }
        } else {
            setMode('chat')
            setMessages([]);
        }
    }

    const handleKeyUp = async(e: any) => {
        if(e.key == 'Enter' && !loading) {
            if(repo == '') {
                window.alert("WARNING: Set the path to your repository!!!");
                return;
            }
            setLoading(true);
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
            setLoading(false);
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
        setLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/reject?${params.toString()}`, {method: 'POST'});
        setLoading(false);
        setMessages((prevMessages: any[]) => {return [...prevMessages, {response: 'The changes have been successfully reverted to their original state. If you need further assistance or wish to explore other optimizations, feel free to let me know!'}]});
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
            {loading && <LoadingIndicator />}
            <div ref={bottomRef} />
            </div>
            <div className="relative w-full p-1.5 rounded-xl border border-gray-300 flex justify-center">
                {repoSelect && (
                    <div className='absolute -top-11 -left-1 bg-white border border-gray-300 shadow-lg p-2 rounded-lg z-50'>
                        <input className='w-40xl m-1.5 focus:border-transparent focus:outline-none focus:ring-0' placeholder="Path to your codebase" onKeyUp={handleRepoInput}></input>
                    </div>
                )}
                {repo != '' && (
                    <div className='z-50 absolute bg-white -top-16 right-2 border border-gray-400 rounded-xl p-1 flex flex-col '>
                        <button onClick={() => setRepo('')} className='self-end'><IoIosCloseCircle /></button>
                        <span className='text-gray-400 text-sm'>{repo}</span>
                        <span className='text-sm'>Path</span>
                    </div>
                )}
                <button className='text-2xl  mr-2 h-fit' onClick={() => setRepoSelect(!repoSelect)}>+</button>
                <textarea className="w-19/20 m-1.5 focus:border-transparent focus:outline-none focus:ring-0" placeholder="Ask about your codebase" onKeyUp={handleKeyUp}></textarea>
            </div>
        </div>
    )
}