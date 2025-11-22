import { cookies } from "next/headers";

import { ANON_USER_COOKIE } from "@/lib/constants";
import { db, chatMessages } from "@/db/client";
import { eq, asc } from "drizzle-orm";

export default async function ChatHistoryPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(ANON_USER_COOKIE)?.value ?? null;

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
          <p className="text-[14px] sm:text-[15px] text-[#ADBEBF]">
            No user session found. Visit the app first to obtain an anon ID.
          </p>
        </main>
      </div>
    );
  }

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(asc(chatMessages.createdAt));

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#E7FDFF]">
            Chat History
          </h1>
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#88AEB1]">
            Generated strategies and prompts associated with your anon session.
          </p>
        </header>

        {messages.length === 0 ? (
          <p className="text-[13px] sm:text-[14px] text-[#ADBEBF]">
            No chat history yet. Create a strategy from the dashboard to start
            chatting with Nir.
          </p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="rounded-xl border border-[#EDFCFE0F] bg-[#070B0B] px-4 sm:px-5 py-3 sm:py-4"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-[#89A8AA]">
                    {msg.role === "user" ? "You" : "Nir"}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#617678]">
                    {msg.createdAt?.toString?.() ?? ""}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-[13px] sm:text-[14px] text-[#CDEFF1]">
                  {msg.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
