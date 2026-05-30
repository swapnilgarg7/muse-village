import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "~/firebase/auth";
import { contactSchema } from "../schema/contactSchema";
import { useToastMessages } from "@/components/message/useToastMessages";
import { db } from "~/firebase/firebase";

interface Message {
  id: string;
  subject: string;
  email: string;
  message: string;
}

export const useContact = () => {
  const params = useParams();
  const router = useRouter();
  const { authUser } = useAuth();
  const { Success, Warn } = useToastMessages();
  const [allMessages, setMessages] = useState<Message[]>([]);
  const [messageUp, setMessage] = useState<Partial<Message>>({});

  const contactId = params?.contact as string | undefined;

  useEffect(() => {
    if (authUser) handleFetch(authUser.email!);
  }, [authUser]);

  useEffect(() => {
    if (contactId) {
      handleFetchMessage(contactId);
    } else {
      setMessage({});
    }
  }, [contactId]);

  const handleFetchMessage = async (id: string) => {
    try {
      const snap = await getDoc(doc(db, "contactus", id));
      if (snap.exists()) setMessage(snap.data() as Message);
    } catch (err) {
      console.error(err);
    }
  };

  const initialValues = {
    subject: messageUp?.subject || "",
    email: authUser?.email || "",
    message: messageUp?.message || "",
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contactus", id));
      Success("Message deleted");
      if (authUser?.email) await handleFetch(authUser.email);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetch = async (email: string) => {
    try {
      const q = query(collection(db, "contactus"), where("email", "==", email));
      const snap = await getDocs(q);
      const data: Message[] = [];
      snap.forEach((d) => data.push({ ...(d.data() as Omit<Message, "id">), id: d.id }));
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
    try {
      if (contactId) {
        await updateDoc(doc(db, "contactus", contactId), values);
        router.push("/contact");
      } else {
        await addDoc(collection(db, "contactus"), values);
      }
      Success("Message sent!");
      if (authUser?.email) handleFetch(authUser.email);
    } catch (err) {
      console.error(err);
      Warn("Failed to send message");
    }
    resetForm();
  };

  return { initialValues, schema: contactSchema, handleSubmit, handleDelete, allMessages };
};
