# Official Geth Image for Eth Client
FROM ethereum/client-go:v1.10.1

# Password to initialise your eth account with
ARG ACCOUNT_PASSWORD

# Copy the genesis.json into the image 
# and use it to initialize the genesis block
# Init Geth instance, remove the nodekey file

COPY genesis.json /tmp
RUN geth init /tmp/genesis.json && rm -f ~/.ethereum/geth/nodekey && echo ${ACCOUNT_PASSWORD} > /tmp/password && geth account new --password /tmp/password && rm -f /tmp/password

# Generate a new account for our Ethereum 
# blockchain. Then remove the password file 
# from the image for security purpose.
RUN echo ${ACCOUNT_PASSWORD} > /tmp/password && geth account new --password /tmp/password rm -f /tmp/password

ENTRYPOINT ["geth"]
