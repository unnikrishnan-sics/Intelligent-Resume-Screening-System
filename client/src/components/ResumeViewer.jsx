import React from 'react';

const ResumeViewer = ({ url, fileName }) => {
    if (!url) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <p>Select a resume to view the preview</p>
            </div>
        );
    }

    const isPDF = fileName?.toLowerCase().endsWith('.pdf') || url.toLowerCase().endsWith('.pdf');
    const isDoc = fileName?.toLowerCase().endsWith('.docx') || fileName?.toLowerCase().endsWith('.doc') || 
                  url.toLowerCase().endsWith('.docx') || url.toLowerCase().endsWith('.doc');
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isPDF) {
        return (
            <iframe
                src={url}
                title="Resume PDF Viewer"
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        );
    }

    if (isDoc) {
        if (isLocalhost) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                    <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>DOCX Preview (Localhost)</h4>
                    <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
                        Direct DOCX previewing is not available on localhost. Please download the file to view it or deploy to production for cloud previewing.
                    </p>
                    <a href={url} download className="btn btn-primary">
                        Download DOCX
                    </a>
                </div>
            );
        } else {
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
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Preview Not Available</h4>
            <p style={{ marginBottom: '1.5rem' }}>This file type cannot be previewed in the browser.</p>
            <a href={url} download className="btn btn-primary">
                Download File
            </a>
        </div>
    );
};

export default ResumeViewer;
