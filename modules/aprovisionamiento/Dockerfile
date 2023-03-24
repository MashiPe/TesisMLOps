FROM ubuntu:focal
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get install wget -y
RUN apt-get install python3-pip -y
RUN apt-get install libpq5 -y && apt-get install libpq-dev -y
#RUN wget -qO- https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc | gpg --dearmor -o /usr/share/keyrings/r-project.gpg
#RUN echo "deb [signed-by=/usr/share/keyrings/r-project.gpg] https://cloud.r-project.org/bin/linux/ubuntu jammy-cran40/" | tee -a /etc/apt/sources.list.d/r-project.list
RUN apt-get update
#RUN apt-get install -y r-base
RUN apt-get install -y texlive-latex-extra
RUN pip3 install flask
RUN pip3 install -U scikit-learn==1.2.0
RUN pip3 install -U matplotlib==3.6.2
RUN pip3 install -U pandas==1.5.2
RUN pip3 install -U seaborn==0.12.1
RUN pip3 install -U psycopg2-binary==2.9.5
RUN pip3 install -U joblib==1.2.0
RUN pip3 install -U sqlalchemy==1.4.45
RUN pip3 install -U psycopg==3.1.5
RUN pip3 install -U fpdf==1.7.2
RUN pip3 install -U plot-likert==0.4.0
RUN pip3 install -U factor_analyzer==0.4.1
RUN pip3 install -U kaleido==0.2.1
RUN pip3 install plotly==5.13.0
ADD ejecutorScripts.py /root
COPY scripts /root/scripts
RUN mkdir -p /root/images
WORKDIR /root

EXPOSE 4001

CMD ["python3","ejecutorScripts.py"]