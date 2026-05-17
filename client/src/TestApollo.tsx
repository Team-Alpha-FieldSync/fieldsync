import { useQuery} from "@apollo/client/react";
import { gql } from "@apollo/client";

const PING = gql`
  query Ping{
    me{
        id
        email
        role
    }
  }  
`;

export default function TestApollo(){
    const {data, loading, error} = useQuery(PING);

    if(loading) return <div>Loading</div>;
    if(error) return <div style={{color: "red"}}>Error: {error.message}</div>;

    return(
        <pre style={{padding: 16, background: "#f4f4f2", fontSize: 14}}>
            Apollo connected!{"\n"}
            Response: {JSON.stringify(data, null, 2)}
        </pre>
    )
}