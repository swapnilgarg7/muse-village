"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db, auth as firebaseAuth } from "~/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Send, ArrowLeft, MessageSquare, Music } from "lucide-react";
import Loading from "@/components/loader/Loading";

interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantEmails: Record<string, string>;
  lastMessage: string;
  lastMessageAt: Timestamp | null;
  gigTitle?: string;
  createdAt: Timestamp;
  unreadCount?: Record<string, number>;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: Timestamp | null;
}

function formatTime(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  const date = ts.toDate();
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("c");

  const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(undefined);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConvId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => setFirebaseUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", firebaseUser.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const convs: Conversation[] = [];
        snap.forEach((d) => convs.push({ id: d.id, ...(d.data() as Omit<Conversation, "id">) }));
        convs.sort((a, b) => {
          const aMs = a.lastMessageAt?.toMillis() ?? a.createdAt?.toMillis() ?? 0;
          const bMs = b.lastMessageAt?.toMillis() ?? b.createdAt?.toMillis() ?? 0;
          return bMs - aMs;
        });
        setConversations(convs);
        setLoadingConvs(false);
      },
      (err) => {
        console.error("Conversations listener error:", err);
        setLoadingConvs(false);
      }
    );
    return () => unsub();
  }, [firebaseUser]);

  useEffect(() => {
    if (!selectedConvId) { setActiveConv(null); return; }
    const fromList = conversations.find((c) => c.id === selectedConvId);
    if (fromList) { setActiveConv(fromList); return; }
    getDoc(doc(db, "conversations", selectedConvId))
      .then((snap) => {
        if (snap.exists()) setActiveConv({ id: snap.id, ...(snap.data() as Omit<Conversation, "id">) });
      })
      .catch(console.error);
  }, [selectedConvId, conversations]);

  useEffect(() => {
    if (!selectedConvId || !firebaseUser) return;
    updateDoc(doc(db, "conversations", selectedConvId), {
      [`unreadCount.${firebaseUser.uid}`]: 0,
    }).catch(() => {});
  }, [selectedConvId, firebaseUser]);

  useEffect(() => {
    if (!selectedConvId) { setMessages([]); return; }
    const q = query(
      collection(db, "conversations", selectedConvId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = [];
      snap.forEach((d) => msgs.push({ id: d.id, ...(d.data() as Omit<Message, "id">) }));
      setMessages(msgs);
    });
    return () => unsub();
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOtherName = useCallback(
    (conv: Conversation) => {
      if (!firebaseUser) return "Unknown";
      const otherId = conv.participants.find((p) => p !== firebaseUser.uid);
      return otherId ? conv.participantNames?.[otherId] || "Unknown" : "Unknown";
    },
    [firebaseUser]
  );

  const handleSelectConv = (convId: string) => {
    setSelectedConvId(convId);
    setMessages([]);
  };

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !selectedConvId || !firebaseUser || !activeConv || sending) return;
    setSending(true);
    setNewMessage("");
    try {
      const now = Timestamp.now();
      const otherId = activeConv.participants.find((p) => p !== firebaseUser.uid);
      await addDoc(collection(db, "conversations", selectedConvId, "messages"), {
        senderId: firebaseUser.uid,
        text,
        createdAt: now,
      });
      await updateDoc(doc(db, "conversations", selectedConvId), {
        lastMessage: text,
        lastMessageAt: now,
        ...(otherId ? { [`unreadCount.${otherId}`]: increment(1) } : {}),
      });
    } catch (err) {
      console.error(err);
      setNewMessage(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (firebaseUser === undefined) return <Loading />;
  if (!firebaseUser) { router.push("/login"); return null; }

  const showListOnly = !selectedConvId;

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-main py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className="bg-white rounded-2xl shadow-amber border border-amber-100/60 overflow-hidden flex"
          style={{ height: "calc(100vh - 120px)", minHeight: 520 }}
        >
          {/* Sidebar */}
          <div
            className={`w-full md:w-80 shrink-0 flex flex-col border-r border-amber-100 ${
              selectedConvId ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Sidebar Header */}
            <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/50">
              <h1 className="text-lg font-bold text-amber-900">Messages</h1>
              {conversations.length > 0 && (
                <p className="text-xs text-amber-500 mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
              )}
            </div>

            {loadingConvs ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full border-3 border-amber-100 border-[3px]" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-t-amber-600 animate-spin" />
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-7 h-7 text-amber-400" />
                </div>
                <p className="text-amber-800 font-semibold text-sm mb-1">No conversations yet</p>
                <p className="text-amber-500 text-xs mb-4 leading-relaxed">
                  Browse gigs and click &ldquo;Get in Touch&rdquo; to start a conversation
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors active:scale-95"
                >
                  Browse Gigs
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {conversations.map((conv) => {
                  const otherName = getOtherName(conv);
                  const initial = otherName[0]?.toUpperCase() || "?";
                  const isSelected = conv.id === selectedConvId;
                  const unread = conv.unreadCount?.[firebaseUser.uid] || 0;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-amber-50 transition-colors border-b border-amber-50/70 ${
                        isSelected ? "bg-amber-50 border-l-2 border-l-amber-500" : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700"
                        }`}>
                          {initial}
                        </div>
                        {unread > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className={`text-sm truncate ${unread > 0 ? "font-bold text-amber-900" : "font-semibold text-amber-800"}`}>
                            {otherName}
                          </span>
                          <span className="text-[11px] text-amber-400 shrink-0 ml-2">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        {conv.gigTitle && (
                          <p className="text-[11px] text-amber-500 truncate flex items-center gap-1">
                            <Music className="w-2.5 h-2.5 shrink-0" />
                            {conv.gigTitle}
                          </p>
                        )}
                        <p className={`text-xs truncate mt-0.5 ${unread > 0 ? "font-medium text-amber-700" : "text-amber-400"}`}>
                          {conv.lastMessage || "Start the conversation..."}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Thread Panel */}
          <div className={`flex-1 flex flex-col min-w-0 ${showListOnly ? "hidden md:flex" : "flex"}`}>
            {!selectedConvId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-amber-300" />
                </div>
                <p className="text-amber-800 font-semibold">Select a conversation</p>
                <p className="text-amber-400 text-sm mt-1">Choose from the list to start messaging</p>
              </div>
            ) : (
              <>
                {/* Thread Header */}
                <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/30 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedConvId(null)}
                    className="md:hidden p-1.5 text-amber-600 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  {activeConv ? (
                    <>
                      <div className="h-9 w-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {getOtherName(activeConv)[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-amber-900 text-sm">{getOtherName(activeConv)}</p>
                        {activeConv.gigTitle && (
                          <p className="text-xs text-amber-500 flex items-center gap-1 truncate">
                            <Music className="w-2.5 h-2.5 shrink-0" />
                            {activeConv.gigTitle}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="h-5 w-36 bg-amber-100 rounded animate-pulse" />
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-2 scrollbar-thin bg-amber-50/20">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-3">
                        <Music className="w-6 h-6 text-amber-400" />
                      </div>
                      <p className="text-amber-600 font-medium text-sm">
                        {activeConv ? `Say hi to ${getOtherName(activeConv)}!` : "No messages yet."}
                      </p>
                      <p className="text-amber-400 text-xs mt-1">Start your collaboration</p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isMe = msg.senderId === firebaseUser.uid;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed ${
                              isMe
                                ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-2xl rounded-br-md shadow-sm"
                                : "bg-white text-amber-900 rounded-2xl rounded-bl-md border border-amber-100 shadow-sm"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.createdAt && (
                              <p className={`text-[10px] mt-1.5 ${isMe ? "text-amber-200" : "text-amber-400"}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 border-t border-amber-100 bg-white flex items-end gap-2.5 shrink-0">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)"
                    rows={1}
                    className="flex-1 px-4 py-2.5 border border-amber-200 bg-amber-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none text-sm text-amber-900 placeholder-amber-400 transition-all"
                    style={{ maxHeight: 100, overflowY: "auto" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="p-2.5 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm active:scale-95"
                  >
                    <Send className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
