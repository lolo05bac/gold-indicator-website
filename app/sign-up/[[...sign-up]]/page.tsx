import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#08090D", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SignUp afterSignUpUrl="/dashboard" />
    </div>
  );
}
