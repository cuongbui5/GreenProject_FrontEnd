import Link from "next/link";

export default function ForbiddenPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-6xl font-extrabold text-red-600">403</h1>
                <p className="text-xl text-gray-700 mt-4">You do not have permission to access this page.</p>
                <Link href="/home">
                    <p className="mt-8 inline-block px-6 py-3 text-white bg-blue-500 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300">
                        Go back to Home
                    </p>
                </Link>
            </div>
        </div>
    );
}