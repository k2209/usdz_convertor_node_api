# USDZ Convertor Node API By [AhuraTechnosoft](https://ahuratechnosoft.com)

A self-hosted REST API to convert `.glb` 3D models to `.usdz` format using Docker, Node.js, and the [usd_from_gltf](https://github.com/google/usd_from_gltf) converter.  
Easily deploy on your own server to offer fast USDZ conversion for iOS AR experiences.



## Features

- Accepts remote `.glb` file URLs via API.
- Downloads and converts them to `.usdz` using Docker.
- Serves `.usdz` files over HTTP(S) for instant AR QuickLook on iOS.
- Easy to set up with Node.js and Docker.

<pre>
usdz_convertor_node_api/
├── usd-from-gltf/                 # Google 'usd_from_gltf' source and main Dockerfile for building
│   └── Dockerfile
│
├── usd/                           # Pixar USD source/libraries; may also contain its own Dockerfile
│   └── Dockerfile
│
├── usdz_convertor_api/           # Node.js Express API for conversion
│   ├── public/                   # Publicly accessible files
│   │   └── converted/            # Output folder for converted USDZ files
│   │
│   ├── temp/                     # Temporary files used during conversion (auto-deleted post-process)
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── config.js                 # Configuration file
│   ├── package.json              # Node.js dependencies and scripts
│   ├── package-lock.json
│   ├── sample.env                # Sample environment variable file
│   └── server.js                 # Main entry point for the Express API
│
├── README.md                     # Project documentation
</pre>


## Requirements

- Ubuntu 20.04+ (or any Linux with Docker)
- **Docker** installed and running
- **Node.js** v16+ and **npm**
- Open port `3003` (or your chosen API port)
- (For HTTPS) SSL certificates (Let's Encrypt recommended)


## Quick Setup
### 1. Clone the Repository

```
git clone https://github.com/yourusername/usdz_convertor_node_api.git

cd usdz_convertor_node_api
```

### 2. Build the Docker Image
You must first build the base USD image, which is used for all further builds.

```
cd usd
docker build -t leon/usd:latest .
```

This will create a Docker image named leon/usd:latest from the Dockerfile inside the usd folder.

Tip: This step can also take some time (10–15 minutes) the first time, as it builds all USD dependencies.

### Build the glTF-to-USDZ Image
Now you can build the final Docker image for the API (which depends on the base USD image):
```
cd ../usd-from-gltf
docker build -t gltf-to-usdz:latest .
```
This image will use the USD tools and add usd_from_gltf on top.

Tip: The first build will be slower, but subsequent builds are faster.


### 3. Install Node.js Dependencies
```
cd ../usdz_convertor_api
npm install
```
### 4. Configure Your Environment
Create a .env file in usdz_convertor_api (optional, for domain/port customization):
```
env
PORT=3003
DOMAIN=https://your-domain.com:3003
NODE_ENV=production
```
### 5. Start the Node API
``` node server.js ```
#### Or with PM2 for background run:


### 6. (Optional) Serve via Nginx
You can reverse proxy the /converted directory for pretty URLs, but it's not required.

API Usage
Convert .glb to .usdz
Endpoint:
```
GET /convertglbtousdz?url=<GLB_FILE_URL>
```
Example:
```
curl "https://your-domain.com:3003/convertglbtousdz?url=https://modelviewer.dev/shared-assets/models/Astronaut.glb"
```
Response:
```
{
  "success": true,
  "usdz_url": "https://your-domain.com:3003/converted/Astronaut.usdz"
}
```
Health Check
Endpoint:
```PATCH /health```
```
Response:
{
  "message": "From USDZ Convertor",
  "success": true
}
```
Notes
Temporary and output files are auto-cleaned after serving.
Ensure Docker can run as the same user as Node.js or use sudo if required.
For large .glb files, network speed and Docker build time can affect conversion speed.

Credits
- [leon/docker-gltf-to-udsz](https://github.com/leon/docker-gltf-to-udsz)
- [Google usd_from_gltf](https://github.com/google/usd_from_gltf)
- [Pixar USD](https://github.com/PixarAnimationStudios/USD)
- Node.js, Express, Docker
