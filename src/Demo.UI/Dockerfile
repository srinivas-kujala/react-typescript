#========================================================================================================================#
# Begin common commands                                                                                                  #
#========================================================================================================================#

# Use node as base
FROM node:current-alpine3.18

# Set build arguments. Default values
ENV SERVE=dev

#========================================================================================================================#
# End common commands                                                                                                    #
#========================================================================================================================#

#========================================================================================================================#
# Begin demo ui installation commands                                                                                    #
#========================================================================================================================#

# Set working directory
WORKDIR "/app"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose ports
EXPOSE 5173

# NOTE: 
# We need to build app outside the container.
# Application to build successfully we need certificates.
# Certificates are created on hostmache $APPDATA/ASP.NER/Https (Windows) or $HOME/.aspnet/https (Linux/Mac)
# Execute npm run build from ./src/
#
# Copy files from host machine to image
COPY ./dist .

#========================================================================================================================#
# End demo ui installation commands                                                                                      #
#========================================================================================================================#

#========================================================================================================================#
# The container stays up as long as this process is running                                                              #
#========================================================================================================================#

# Health check to verify the web service is running
HEALTHCHECK --interval=30s --timeout=10s --retries=10 \
CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1;

# Start the React app
CMD "npm" "run" ${SERVE}-docker

#========================================================================================================================#