FROM public.ecr.aws/lambda/nodejs:18

# Assumes your function is named "app.js", and there is a package.json file in the app directory 
COPY . ${LAMBDA_TASK_ROOT}/
WORKDIR ${LAMBDA_TASK_ROOT}

RUN yum groupinstall "Development Tools" -y
RUN yum install -y java-1.7.0-openjdk.x86_64 java-1.8.0-openjdk-devel.x86_64 gcc-c++ python3.x86_64
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]