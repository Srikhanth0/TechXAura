export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin-reverse"></div>
            </div>
        </div>
    );
}
