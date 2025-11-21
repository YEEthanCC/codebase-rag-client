import { useState } from 'react'
import { use } from 'react'
import RepoSelect from './RepoSelect';
import { VscCopilot } from "react-icons/vsc";
import { v4 as uuidv4 } from 'uuid';



export default function UserInput({ onMessageUpdate, mode }: { onMessageUpdate: (msg: any) => void; mode: string; }) {
    const [repo, setRepo] = useState<string>('');
    const [repoSelect, setRepoSelect] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string>(uuidv4());
    const [question, setQuestion] = useState<string>('');

    const handleKeyUp = async(e: any) => {
        if(e.key === 'Enter' && repo != '') {
            setQuestion(e.target.value)
            onMessageUpdate({message: e.target.value});
            const params = new URLSearchParams({
                question: e.target.value, 
                repo_path: repo,
                session_id: sessionId,
            })
            e.target.value = '';
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/query?${params.toString()}`)
            const response = await res.json()
            onMessageUpdate(response)
        } 
    }

    const optimizeCode = async(e: any) => {
        if(repo != '') {
            const newSessionId = uuidv4();
            setSessionId(newSessionId);
            const params = new URLSearchParams({ 
                repo_path: repo, 
                session_id: newSessionId, 
             });
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/repo/optimize?${params.toString()}`, {method: 'POST'});
            const response = await res.json();
            onMessageUpdate(response)
        }
    }

    const handleRepoInput = async(e: any) => {
        if(e.key == 'Enter') {
            setRepo(e.target.value);
            setRepoSelect(!repoSelect);
            setSessionId(uuidv4());
        }
    }


    return (
        <div className="relative w-4/5 p-1.5 rounded-xl border border-gray-300 flex justify-center">
            {repoSelect && (
                <div className='absolute -top-11 -left-1 bg-white border border-gray-300 shadow-lg p-2 rounded-lg z-50'>
                    <input className='w-40xl m-1.5 focus:border-transparent focus:outline-none focus:ring-0' placeholder="Path to your codebase" onKeyUp={handleRepoInput}></input>
                </div>
            )}
            <button className='text-2xl m-1.5 mr-2' onClick={() => setRepoSelect(!repoSelect)}>+</button>
            <input className="w-8/9 m-1.5 focus:border-transparent focus:outline-none focus:ring-0" placeholder="Ask about your codebase" onKeyUp={handleKeyUp}></input>
            <button className='text-xl m-1.5' onClick={optimizeCode}><VscCopilot /></button>
        </div>

    )
}