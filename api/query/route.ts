export async function GET(question: string, repo: string, sessionId: string) {
    const params = new URLSearchParams({
        question: question,
        repo: repo, 
        sessionId: sessionId,
    })
    return fetch(`${process.env.BASE_URL}/repo/query?${params.toString()}`)
}