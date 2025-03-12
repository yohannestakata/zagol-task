export default function WaitingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Please Check Your Email</h1>
        <p className="text-zinc-400">
          We've sent a verification link to your email. Please check your inbox
          and click the link to complete your registration.
        </p>
      </div>
    </div>
  );
}
