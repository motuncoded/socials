import Image from "next/image";

export interface Data {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export async function getServerSideProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data: Data[] = await res.json();
    console.log(data);
  return {
    props: {
      data
      },
  };
}
export default function Home({ data }: {data : Data[]} ) {
  type Posts = {
    id: number;
    title: string;
    body: string;
    userId: number;
  };

  const displayData = data.map((posts: Data) => {
    return (
      <div key={posts.id}>
            <p className="text-white">{posts.title}</p>
            
      </div>
    );
  });

  return <div>{displayData}</div>;
}


