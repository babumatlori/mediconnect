export default function NotFoundPage() {
    return (
        <div className="flex items-center justify-normal min-h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-secondary-200">404</h1>
                <p className="text-secondary-500 mt-2">Page not found</p>
                <a href="/" className="btn-primary mt-4 inline-block"> Go Home</a>
            </div>
        </div>
    );
}
