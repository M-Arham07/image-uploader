"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RetrieveURL from "@/server-utilities/RetrieveURL";

export default function RetrievePage() {
    const [shareCode, setShareCode] = useState("");
    const [retrievedUrl, setRetrievedUrl] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const downloadRef = useRef(null);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setStatus("loading");
            setError("");

            // CALL SERVER ACTION TO RETRIEVE URL!
            const imgURL = await RetrieveURL(shareCode);

            setRetrievedUrl(imgURL);
            setStatus("success");
            return true;

        }
        catch (err) {
            setStatus("idle");
            setError(err?.message || "Server Down! Please try again later.");
            return false;
        }
    }



    const resetForm = () => {
        setShareCode("");
        setRetrievedUrl("");
        setStatus("idle");
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pb-45 sm:pb-0">
            <Card className="w-full max-w-md bg-transparent shadow-accent">
                {!retrievedUrl ? (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">Retrieve Shared Images</CardTitle>
                            <CardDescription>
                                Enter your share code to access the shared images.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Share Code</Label>
                                    <Input
                                        id="code"
                                        value={shareCode}
                                        onChange={(e) => setShareCode(e.target.value)}
                                        placeholder="e.g. a1b2"
                                        minLength={4}
                                        required
                                    />
                                </div>
                                {error && (
                                    <div className="text-red-500 text-sm flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}
                                <Button type="submit" className="w-full cursor-pointer" disabled={status === "loading"}>
                                    {status === "loading" ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Retrieving...
                                        </>
                                    ) : (
                                        "Retrieve Image"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className=" justify-center">
                            <Button variant="outline" className="w-full -mt-2.5" asChild>
                                <Link href="/">Share Images</Link>
                            </Button>
                        </CardFooter>
                    </>
                ) : (
                    <>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={resetForm} className="h-8 w-8 mr-2" aria-label="Back">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <span>Retrieved Images</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                                {retrievedUrl.map(url => (
                                    <div key={url} className="w-full rounded-lg border shadow-sm overflow-hidden">
                                        <img
                                            src={url}
                                            alt="Retrieved Shared"
                                            className="w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                className="w-full mb-2 cursor-pointer"
                                variant="default"
                                onClick={async () => {
                                    try {
                                        // Download all images sequentially
                                        for (let i = 0; i < retrievedUrl.length; i++) {
                                            const response = await fetch(retrievedUrl[i], { mode: 'cors' });
                                            const blob = await response.blob();
                                            const blobUrl = window.URL.createObjectURL(blob);
                                            if (downloadRef.current) {
                                                const DATE = `${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getFullYear()).slice(-2)}`;
                                                downloadRef.current.href = blobUrl;
                                                downloadRef.current.download = `shared-image-${i + 1}(${DATE}).jpg`;
                                                downloadRef.current.click();
                                                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between downloads
                                                window.URL.revokeObjectURL(blobUrl);
                                            }
                                        }
                                    } catch (err) {
                                        alert('Failed to download some images');
                                    }
                                }}
                            >
                                Download All Images
                            </Button>
                            <a ref={downloadRef} style={{ display: 'none' }}>hidden download</a>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}