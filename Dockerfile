FROM httpd:2.4

# 기본 Apache 설정 파일 복사
COPY ./apache-config/httpd.conf /usr/local/apache2/conf/httpd.conf

# 웹사이트 파일들을 Apache의 기본 문서 루트로 복사
COPY . /usr/local/apache2/htdocs/ 