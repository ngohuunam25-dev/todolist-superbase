import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutUser } from "@/features/auth/userSlice";
import { supabase } from "@/utils/supabase";
import { CheckCircle, Circle, LogOut, Plus, Trash2 } from "lucide-react";
import React from "react";

type Note = {
  content: string;
  created_at: string;
  id: string;
  title: string;
  user_id: string;
};
export default function MyToDoList() {
  const dispatch = useAppDispatch();
  // Todo Form States
  const [newTitle, setNewTitle] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [error, setError] = React.useState<string>("");
  const { user } = useAppSelector((state) => state.user);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách");
    }
  };

  const handleSignOut = () => {
    dispatch(logoutUser());
  };
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: newTitle,
            content: newContent,
            user_id: user?.id,
          },
        ])
        .select();

      if (error) throw error;
      fetchNotes();
      setNewTitle("");
      setNewContent("");
    } catch (err: any) {
      setError(err.message || "Lỗi tạo ghi chú");
    }
  };
  const handleToggleComplete = async (note: Note) => {
    try {
      const updatedContent = note.content.includes("✓")
        ? note.content.replace("✓ ", "")
        : `✓ ${note.content}`;

      const { error } = await supabase
        .from("notes")
        .update({ content: updatedContent })
        .eq("id", note.id);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật");
    }
  };
  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;
      fetchNotes();
    } catch (err: any) {
      setError(err.message || "Lỗi xóa ghi chú");
    }
  };

  React.useEffect(() => {
    fetchNotes();
  }, []);

  console.log("user", user);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-indigo-600">
              📋 Todo List của tôi
            </h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
          <p className="mt-2 text-gray-600">👤 {user?.email}</p>
        </div>
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
        {/* Create Form */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
          <form onSubmit={handleCreateNote} className="space-y-4">
            <input
              type="text"
              placeholder="Tiêu đề công việc..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              placeholder="Mô tả chi tiết..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Plus size={20} />
              Thêm công việc
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-xl">
              Chưa có công việc nào. Hãy thêm công việc đầu tiên! 🎯
            </div>
          ) : (
            notes.map((note) => {
              const isCompleted = note.content.includes("✓");
              return (
                <div
                  key={note.id}
                  className="rounded-2xl bg-white p-6 shadow-xl transition-shadow hover:shadow-2xl"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleComplete(note)}
                      className="mt-1 text-indigo-600 hover:text-indigo-700"
                    >
                      {isCompleted ? (
                        <CheckCircle size={24} className="text-green-500" />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-semibold ${
                          isCompleted
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {note.title}
                      </h3>
                      <p
                        className={`mt-2 ${
                          isCompleted
                            ? "text-gray-400 line-through"
                            : "text-gray-600"
                        }`}
                      >
                        {note.content.replace("✓ ", "")}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(note.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 transition-colors hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
