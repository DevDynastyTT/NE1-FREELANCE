//localhost:3000/api/users
 export async function GET(request){
    //Handle GET request for /api/users
    //Retrieve users from the database or any data source

    const users = [
        { id: 1, name: "John"},
        { id: 2, name: "Doe"},
        { id: 3, name: "Show"}
    ]

    return new Response(JSON.stringify(users))
}