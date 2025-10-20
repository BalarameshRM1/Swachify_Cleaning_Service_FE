import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "./app/hooks.ts";
import { fetchPosts } from "./app/features/posts/postsSlice.ts";
import {selectLoading, selectError } from "./app/features/posts/postsSelectors";

import './App.css'
import { clearPosts } from "./app/features/posts/postsSlice.ts";
// import Dashboard from './pages/dashboard/Dashboard.tsx';
import { AppRoutes } from './Routes/AppRoutes.tsx';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';

function App() {

  const dispatch = useAppDispatch();
  // const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchPosts());
    () => dispatch(clearPosts());
  }, [dispatch]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <>
    <AppRoutes />
    <WhatsAppButton />
      {/* <Dashboard  /> */}
       {/* <div style={{ padding: "20px" }}>
        <h1>📄 Posts List</h1>
        <ul>
          {posts.slice(0, 10).map((post) => (
            <li key={post.id} style={{ marginBottom: "10px" }}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      </div> */}
    </>
  )
}
export default App