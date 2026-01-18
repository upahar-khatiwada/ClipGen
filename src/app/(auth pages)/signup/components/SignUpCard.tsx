import SignupForm from "./SignUpForm";

const SignUpCard = () => {
  return (
    <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
      <div className="px-8 pt-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Join <strong>ClipGen</strong>, An AI Short Generator and start creating shorts in seconds
        </p>
      </div>

      <div className="px-8 pt-6 pb-8">
        <SignupForm />
      </div>

      <div className="border-t px-8 py-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-gray-900 hover:underline">
          Login Now
        </a>
      </div>
    </div>
  );
};

export default SignUpCard;
