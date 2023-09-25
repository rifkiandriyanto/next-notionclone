import React from "react";
import EditablePage from "../components/editablePage";

interface IndexPageProps {
  pid: string | null;
  blocks: any[] | null;
  err: boolean;
}

const IndexPage: React.FC<IndexPageProps> = ({ pid, blocks, err }) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async (
  context
) => {
  const blocks = [{ tag: "p", html: "", imageUrl: "" }];
  const res = context.res;
  const req = context.req;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pages`, {
      method: "POST",
      credentials: "include",
      // Forward the authentication cookie to the backend
      headers: {
        "Content-Type": "application/json",
        Cookie: req ? req.headers.cookie : undefined,
      },
      body: JSON.stringify({
        blocks: blocks,
      }),
    });
    const data = await response.json();
    const pageId = data.pageId;
    const creator = data.creator;
    const query = !creator ? "?public=true" : ""; // needed to show notice
    res.writeHead(302, { Location: `/p/${pageId}${query}` });
    res.end();
    return { props: {} };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: null, err: true } };
  }
};

export default IndexPage;
