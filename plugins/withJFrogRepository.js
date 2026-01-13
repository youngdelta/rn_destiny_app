const { withProjectBuildGradle } = require("expo/config-plugins");

const JFROG_MAVEN_REPO = "maven { url 'https://releases.jfrog.io/artifactory/oss-release-local' }";

function addJFrogRepository(buildGradle) {
  // Skip if already added
  if (buildGradle.includes("releases.jfrog.io")) {
    return buildGradle;
  }

  // Add to buildscript.repositories - find mavenCentral() and add after it
  buildGradle = buildGradle.replace(
    /(buildscript\s*\{[\s\S]*?repositories\s*\{[\s\S]*?)(mavenCentral\(\))/,
    `$1$2\n        ${JFROG_MAVEN_REPO}`
  );

  // Add to allprojects.repositories - find jitpack and add after it
  buildGradle = buildGradle.replace(
    /(allprojects\s*\{[\s\S]*?repositories\s*\{[\s\S]*?)(maven\s*\{\s*url\s*'https:\/\/www\.jitpack\.io'\s*\})/,
    `$1$2\n        ${JFROG_MAVEN_REPO}`
  );

  return buildGradle;
}

const withJFrogRepository = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addJFrogRepository(
        config.modResults.contents
      );
    }
    return config;
  });
};

module.exports = withJFrogRepository;
