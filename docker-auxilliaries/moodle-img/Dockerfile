FROM bitnami/moodle:3.8.0


# Make apt package available
RUN apt update
RUN apt upgrade -y

# TODO temporarly install vim for testing inside the container. Can be removed later again
RUN apt install -y vim

# Install git and clone plugin (be careful with new versions of plugin, that are not yet included in DB dump)
RUN apt install -y git
RUN git clone https://gitlab.forge.hefr.ch/uchendu.nwachukw/wafed_moodle_webservice_plugin.git /bitnami/moodle/local/wafed_moodle_webservice_plugin

# Define the healthcheck measure
HEALTHCHECK --interval=1m --timeout=10s --retries=20 \
  CMD curl --fail http://localhost || exit 1