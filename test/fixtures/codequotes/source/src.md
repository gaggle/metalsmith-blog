{% codeblock lang:json %}
{
  "safari-os-x-10.11-latest": {
    "base": "SauceLabs",
    "browserName": "safari",
    "name": "ui-safari-os-x-10.11-latest",
    "platform": "OS X 10.11",
    "version": "latest",
    "tunnel-identifier": [process.env.TRAVIS_JOB_NUMBER],
    "build": [process.env.TRAVIS_BUILD_NUMBER]
  }
}
{% endcodeblock %}
