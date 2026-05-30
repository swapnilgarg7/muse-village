"use client";

import { useRouter } from "next/navigation";
import { BsPencilFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

interface Message {
  id: string;
  subject: string;
  email: string;
  message: string;
}

interface ViewProps {
  messages: Message[];
  handleDelete: (id: string) => void;
}

const TABLE_HEAD = ["Subject", "Email", "Message", "Action"];

export default function View({ messages, handleDelete }: ViewProps) {
  const router = useRouter();

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-amber-600">No messages yet.</div>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-y border-amber-100 bg-amber-50 p-4 text-xs font-semibold text-amber-700 uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {messages.map(({ id, email, subject, message }, index) => {
            const isLast = index === messages.length - 1;
            const cls = isLast ? "p-4" : "p-4 border-b border-amber-50";
            return (
              <tr key={id} className="hover:bg-amber-50 transition-colors">
                <td className={cls}>
                  <span className="text-sm text-amber-900 font-medium">{subject}</span>
                </td>
                <td className={cls}>
                  <span className="text-sm text-amber-700">{email}</span>
                </td>
                <td className={cls}>
                  <span className="text-sm text-amber-700">{message}</span>
                </td>
                <td className={`${cls} flex gap-4 items-center`}>
                  <button onClick={() => router.push(`/contact/${id}`)}>
                    <BsPencilFill className="text-amber-700 text-lg" />
                  </button>
                  <button onClick={() => handleDelete(id)}>
                    <MdDeleteForever className="text-red-500 text-2xl" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
