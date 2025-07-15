# Since USD takes so long to build, we separate it into it's own container
FROM leon/usd:latest

WORKDIR /usr/src/ufg

# Add NASM
RUN apt-get install nasm

# Add PIL
RUN pip install Pillow

# Configuration
ARG UFG_RELEASE="6d288cce8b68744494a226574ae1d7ba6a9c46eb"
ARG UFG_SRC="/usr/src/ufg"
ARG UFG_INSTALL="/usr/local/ufg"
ENV USD_DIR="/usr/local/usd"
ENV LD_LIBRARY_PATH="${USD_DIR}/lib:${UFG_SRC}/lib"
ENV PATH="${PATH}:${UFG_INSTALL}/bin"
ENV PYTHONPATH="${PYTHONPATH}:${UFG_INSTALL}/python"

# Build + install usd_from_gltf
RUN git init
RUN git remote remove origin || true
RUN git remote add origin https://github.com/google/usd_from_gltf.git 
RUN git fetch --depth 1 origin "${UFG_RELEASE}" 
RUN git checkout FETCH_HEAD 
RUN cp /usr/local/usd/lib/libboost_python38.so.1.70.0 /usr/local/usd/lib/libboost_python.so && \
    cp /usr/local/usd/lib/libboost_python38.so.1.70.0 /usr/local/usd/lib/libboost_python3.so && \
    ls -l /usr/local/usd/lib/libboost_python* && \
    python "${UFG_SRC}/tools/ufginstall/ufginstall.py" -v "${UFG_INSTALL}" "${USD_DIR}" && \
    ls  /usr/local/usd/lib/
#RUN python "${UFG_SRC}/tools/ufginstall/ufginstall.py" -v "${UFG_INSTALL}" "${USD_DIR}"
RUN cp -r "${UFG_SRC}/tools/ufgbatch" "${UFG_INSTALL}/python"
RUN rm -rf "${UFG_SRC}" "${UFG_INSTALL}/build" "${UFG_INSTALL}/src"

RUN mkdir /usr/app
WORKDIR /usr/app

# Start the service
ENTRYPOINT ["usd_from_gltf"]
CMD ["usd_from_gltf"]