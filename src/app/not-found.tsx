import Link from "next/link";
import { SITE_NAME } from "#config";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <p className="label text-secondary mb-4">Error 404</p>

            <h1 className="display text-9xl md:text-[12rem] mb-2 leading-none tracking-tighter">
                404
            </h1>

            <h2 className="headline mb-8 max-w-lg mx-auto">Page Not Found</h2>

            <p className="text-xl text-base-content/60 mb-12 max-w-md mx-auto">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="btn btn-primary btn-lg">
                    Back to Homepage
                </Link>
                <Link href="/checkout" className="btn btn-outline btn-lg">
                    Check Cart
                </Link>
            </div>

            <div className="mt-24 pt-8 border-t-2 border-base-content/10 w-full max-w-sm mx-auto">
                <p className="label text-base-content/40">{SITE_NAME}</p>
            </div>
        </div>
    );
}

export default NotFound;
