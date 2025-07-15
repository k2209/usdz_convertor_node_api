const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const { exec } = require('child_process');

const app = express();
const PORT = 3003;

// Paths
const WORK_DIR = path.join(__dirname, 'temp');
const PUBLIC_DIR = path.join(__dirname, 'public', 'converted');
const PUBLIC_URL = 'http://34.47.157.113:/converted'; // Change to your domain

// Ensure working dirs exist
if (!fs.existsSync(WORK_DIR)) fs.mkdirSync(WORK_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// Serve /converted as static
app.use('/converted', express.static(PUBLIC_DIR));

app.patch('/health', (req, res) => res.json({ success: true }));

app.get('/convertglbtousdz', async (req, res) => {
    const glbUrl = req.query.url;
    if (!glbUrl) return res.status(400).json({ error: 'Missing ?url parameter' });

    const id = uuidv4();
    const glbPath = path.join(WORK_DIR, `${id}.glb`);
    const usdzPath = path.join(WORK_DIR, `${id}.usdz`);
    const finalUsdPath = path.join(PUBLIC_DIR, `${id}.usdz`);

    try {
        // Download GLB
        const response = await fetch(glbUrl);
        if (!response.ok) throw new Error('Download failed');
        const fileStream = fs.createWriteStream(glbPath);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        // Convert using Docker
        const dockerCmd = [
            'docker run --rm',
            `-v ${WORK_DIR}:/data`,
            'gltf-to-usdz:latest',
            `/data/${id}.glb /data/${id}.usdz`
        ].join(' ');

        exec(dockerCmd, (err, stdout, stderr) => {
            // Always cleanup GLB after attempt
            fs.unlink(glbPath, () => { });

            if (err) {
                if (fs.existsSync(usdzPath)) fs.unlinkSync(usdzPath);
                return res.status(500).json({ error: 'Conversion failed', details: stderr });
            }

            // Move usdz to public folder
            fs.rename(usdzPath, finalUsdPath, (mvErr) => {
                if (mvErr) {
                    return res.status(500).json({ error: 'Failed to move USDZ', details: mvErr.message });
                }
                // Return the link to the client
                return res.json({
                    success: true,
                    usdz_url: `${PUBLIC_URL}/${id}.usdz`
                });
            });
        });
    } catch (e) {
        if (fs.existsSync(glbPath)) fs.unlinkSync(glbPath);
        if (fs.existsSync(usdzPath)) fs.unlinkSync(usdzPath);
        return res.status(500).json({ error: 'Server error', details: e.message });
    }
});

app.listen(PORT, () => console.log('Server running on port', PORT));
