import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import axios from 'axios';

const ResumeViewer = ({ url, fileName }) => {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isPDF = fileName?.toLowerCase().endsWith('.pdf') || url?.toLowerCase().endsWith('.pdf');
    const isDoc = fileName?.toLowerCase().endsWith('.docx') || url?.toLowerCase().endsWith('.docx');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    useEffect(() => {
        const renderDocx = async () => {
            if (isDoc && isLocalhost && url && containerRef.current) {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(url, { responseType: 'blob' });
                    const blob = response.data;
                    await renderAsync(blob, containerRef.current, null, {
                        className: "docx", // class name in html document for our rendering, default is "docx"
                        inWrapper: true, // enables or disables rendering of highlight, form fields and other non-standard elements in a wrapper, default is true
                        ignoreWidth: false, // disables rendering of width, default is false
                        ignoreHeight: false, // disables rendering of height, default is false
                        ignoreFonts: false, // disables rendering of fonts, default is false
                        breakPages: true, // enables or disables page breaks, default is true
                        ignoreLastRenderedPageBreak: true, // disables rendering of last rendered page break, default is true
                        experimental: false, // enables or disables experimental features, default is false
                        trimXmlDeclaration: true, // enables or disables trimming of xml declaration, default is true
                        debug: false, // enables or disables debug mode, default is false
                    });
                } catch (err) {
                    console.error("Failed to render DOCX:", err);
                    setError("Could not render DOCX file. Please download to view.");
                } finally {
                    setLoading(false);
                }
            }
        };

        renderDocx();
    }, [url, isDoc, isLocalhost]);

    if (!url) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <p>Select a resume to view the preview</p>
            </div>
        );
    }

    if (isPDF) {
        return (
            <iframe
                src={url}
                title="Resume PDF Viewer"
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        );
    }

    if (isDoc && isLocalhost) {
        return (
            <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#f1f5f9', position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(241, 245, 249, 0.8)', zIndex: 10 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="animate-float" style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                            <p>Rendering DOCX...</p>
                        </div>
                    </div>
                )}
                {error ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                        <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>DOCX Preview (Localhost)</h4>
                        <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>{error}</p>
                        <a href={url} download className="btn btn-primary">Download DOCX</a>
                    </div>
                ) : (
                    <div ref={containerRef} className="docx-container" style={{ padding: '20px', minHeight: '100%' }}></div>
                )}
            </div>
        );
    }

    if (isDoc) {
        // Production: Use Google Docs Viewer
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        return (
            <iframe
                src={googleViewerUrl}
                title="Resume DOCX Viewer"
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Preview Not Available</h4>
            <p style={{ marginBottom: '1.5rem' }}>This file type cannot be previewed in the browser.</p>
            <a href={url} download className="btn btn-primary">Download File</a>
        </div>
    );
};

export default ResumeViewer;
