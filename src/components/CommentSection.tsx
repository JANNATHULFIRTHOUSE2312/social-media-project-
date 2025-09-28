"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Comment {
  _id: string;
  text: string;
  userId: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface Props {
  videoId: string;
}

export default function CommentSection({ videoId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // ✅ Fetch all comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch {
        console.error("Failed to fetch comments");
      }
    };
    fetchComments();
  }, [videoId]);

  // ✅ Add new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to comment.");

    try {
      const res = await api.post(`/comments/${videoId}`, { text });
      setComments([res.data, ...comments]);
      setText("");
    } catch {
      toast.error("Failed to post comment.");
    }
  };

  // ✅ Delete comment
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  // ✅ Save edited comment
  const handleEdit = async (id: string) => {
    try {
      const res = await api.put(`/comments/${id}`, { text: editText });
      setComments(comments.map((c) => (c._id === id ? res.data : c)));
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to edit comment.");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {/* ✅ Add Comment Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 mb-6 bg-muted/30 p-2 rounded-lg"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
          />
          <button
  type="submit"
  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
>
  Post
</button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          You must be logged in to post a comment.
        </p>
      )}

      {/* ✅ Comments List */}
      <ul className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <li
              key={c._id}
              className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition"
            >
              {/* Avatar */}
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-sm">
                {c.userId?.username?.[0]?.toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">{c.userId?.username || "Anonymous"}</p>

                {editingId === c._id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => handleEdit(c._id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm mt-1">{c.text}</p>
                )}

                {/* Date */}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(c.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Actions (only owner) */}
              {user && user._id === c.userId?._id && (
                <div className="flex flex-col gap-2 text-xs">
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setEditText(c.text);
                    }}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
