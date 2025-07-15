FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/src/usd

# Install all dependencies (Python, build tools, GCC-8, USD deps)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 python3-pip python3-setuptools python3-venv python3-dev \
    git build-essential cmake nasm \
    gcc-8 g++-8 \
    libxrandr-dev libxcursor-dev libxinerama-dev libxi-dev \
    && update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-8 100 \
    && update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-8 100 \
    && rm -rf /var/lib/apt/lists/*

# USD Environment setup
ENV CC=gcc-8
ENV CXX=g++-8
ENV CXXFLAGS="-std=c++14"
ENV USD_RELEASE="21.02"
ENV USD_INSTALL="/usr/local/usd"
ENV PYTHONPATH="${PYTHONPATH}:${USD_INSTALL}/lib/python"
ENV PATH="${PATH}:${USD_INSTALL}/bin"

# Make python command available as 'python'
RUN ln -s /usr/bin/python3 /usr/bin/python

# Clone USD source code
RUN git clone --branch "v${USD_RELEASE}" --depth 1 https://github.com/PixarAnimationStudios/USD.git /usr/src/usd

# Build and install USD (WITH Python support for GLB→USDZ)
RUN python ./build_scripts/build_usd.py --verbose --prefer-safety-over-speed --no-examples --no-tutorials --no-imaging --no-usdview --draco "${USD_INSTALL}" && \
  rm -rf /usr/src/usd "${USD_INSTALL}/build" "${USD_INSTALL}/src"

VOLUME ["/usr/local/usd"]