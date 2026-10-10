
export function Footer() {
    return (
        <footer className="border-t bg-white mt-12 py-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <img 
                        src="/Bharat Seva.png" 
                        alt="Bharat Seva" 
                        className="h-12 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                    />
                </div>
                <p>&copy; 2026 All rights reserved.</p>
            </div>
        </footer>
    );
}
