"use client";

import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useParams } from "next/navigation";
import { useContact } from "./hook/useContact";
import { useAuth } from "~/firebase/auth";
import View from "./View";

const Contact = () => {
  const params = useParams();
  const { authUser } = useAuth();
  const { initialValues, schema, handleSubmit, handleDelete, allMessages } = useContact();

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">
        {authUser ? `Messages — ${authUser.name || authUser.email}` : "Messages"}
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-50 p-8 mb-10">
        <h2 className="text-xl font-semibold text-amber-900 mb-6">
          {params?.contact ? "Edit Message" : "Send a Message"}
        </h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-amber-800 mb-1">
                Subject
              </label>
              <Field
                type="text"
                name="subject"
                id="subject"
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-1">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                readOnly
                className="w-full px-4 py-3 border border-amber-100 bg-amber-50 rounded-xl text-amber-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-amber-800 mb-1">
                Message
              </label>
              <Field
                as="textarea"
                name="message"
                id="message"
                rows={4}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-colors font-semibold"
            >
              {params?.contact ? "Update Message" : "Send Message"}
            </button>
          </Form>
        </Formik>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-50 p-8">
        <h2 className="text-xl font-semibold text-amber-900 mb-4">Your Messages</h2>
        <View messages={allMessages} handleDelete={handleDelete} />
      </div>
    </section>
  );
};

export default Contact;
