"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "./hook/useLogin";
import { useAuth } from "../../../firebase/auth";
import { useEffect } from "react";
import Loading from "../loader/Loading";

const Login = () => {
  const { initialValues, schema, handleSubmit, handleNavigate, googleSignIn } =
    useLogin();
  const { authUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/dashboard");
    }
  }, [isLoading, authUser]);
  return isLoading || (!isLoading && authUser) ? (
    <Loading />
  ) : (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <Form>
          <main className="flex lg:h-[100vh]">
            <div className="w-full  p-8 md:p-14 flex items-center justify-center ">
              <div className="p-8 w-[600px]">
                <div
                  className="bg-amber-700 text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-amber-800 active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
                  onClick={googleSignIn}
                >
                  <FcGoogle size={42} />
                  <span className="font-bold text-white group-hover:text-white">
                    Login with Google
                  </span>
                </div>

              </div>
            </div>
          </main>
        </Form>
      </Formik>
    </>
  );
};

export default Login;
