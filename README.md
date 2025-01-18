![AirRemote Logo](src/assets/imgs/logo-black.png#gh-light-mode-only)
![AirRemote Logo](src/assets/imgs/logo-white.png#gh-dark-mode-only)

---

🎉 Welcome to the **AirRemote Frontend Repository**! 🎉

Turn your old remote-controlled devices into smart devices! With AirRemote, transform any IR-based device into a web-controllable, automated smart solution.

![AirRemote Demo]()


--- 
## 📝  Description


AirRemote is a solution designed to modernize legacy remote-controlled devices by making them smart and remotely accessible. With AirRemote, users can save the remote control commands of a device and replay them via a web interface remotely or through automated routines, creating a seamless integration of old technology into modern smart home systems.

### 🔧 Core Functionality

AirRemote operates as a universal remote emulator. It works by capturing the infrared (IR) signals from any remote control—regardless of how rare or obscure—and storing them for later use. The device includes an IR receiver and 8 powerful IR transmitters, enabling it to decode, save and replay the captured IR signals across a room. This allows users to:

- Record the IR signals by simply pressing the buttons of their existing remote control onto the AirRemote device.
- Replay the stored signals on command via a web interface.
- Create powerful automations to perform a set of operations at specific times.

With these capabilities, AirRemote turns virtually any device with an IR remote into a smart, remotely controllable appliance.

### 🌟 Project Overview

The **AirRemote** project is divided into three main components. Each part contains instructions on how to deploy / install it:

- [**Embedded Device:**](https://github.com/jugeekuz/AirRemote-Embedded) 
    - A C/C++ PlatformIO project, involving ESP32-based unit with an IR receiver and 8 powerful IR blasters. It records IR signals from any remote control and replays them across the room, enabling universal compatibility.
    
- [**Serverless Backend:**](https://github.com/jugeekuz/AirRemote-Backend) 
    - A Python project using Serverless framework to deploy a scalable AWS-based backend powered by Lambda, DynamoDB, API Gateway, and EventBridge. It ensures secure command storage, user authorization, and efficient routing between the web interface and devices.

- [**Frontend (This Repository):**](https://github.com/jugeekuz/AirRemote-Frontend) 
    - A React JS project providing an application for managing devices, saving IR commands, authenticating users and creating powerful automation routines—all accessible through a sleek web interface.

## 🎥 Demo
Check out the AirRemote in action:

[![Watch the Demo]()](https://www.youtube.com/watch?v=example)


---

## ⚙️ Installation and Setup
 1. Make sure you have `npm` version 10.0+ installed in your system:
    ```bash
    npm -v
    ```
 2. Make sure you have AWS CLI installed and configured:
    ```bash
    aws --version
    ```
 3. Clone this repository:
    ```bash
    git clone https://github.com/jugeekuz/AirRemote-Frontend
    ```
 4. Install dependencies:
    ```bash
    npm install
    ```
 5. Copy .env file produced from the deployment of the [*Serverless Backend*](https://github.com/jugeekuz/AirRemote-Backend) to the root directory of this project.

 6. Build the production build of the project:
    ```bash
    npm run build
    ```
---
## 🚀 Deployment to AWS

1. #### Create S3 Bucket
    ```
    aws s3api create-bucket --bucket <your-bucket-name> --region <your-region-id> --create-bucket-configuration LocationConstraint=<your-region-id>
    ```

2. #### Upload your files
    ```
    aws s3 sync ./dist s3://<your-bucket-name>
    ```

3. #### Configure Route 53
    1. Create a Hosted Zone (Change `unique-string` to some unique value):

        ```
        aws route53 create-hosted-zone --name <hosted-zone-name> --caller-reference unique-string
        ```

    2. Retrieve the NameServers and update them in your domain registrar (verify that the name server change took place using a whois service).

4. #### Request an SSL Certificate using AWS ACM
    - Request a Certificate (region has to be `us-east-1`) and keep the CertificateArn output:
        ```
        aws acm request-certificate --domain-name <your-domain-name> --validation-method DNS --region us-east-1
        ```

5.  #### Create DNS validation records in Route 53
    1. Retrieve the necessary CNAME entries from ACM (use the `CertificateArn` from previous step):
        ```
        aws acm describe-certificate --certificate-arn <your-certificate-arn> --region us-east-1
        ```

    2. Save the following config in `tmp/acm_validation_config.json` (replace <CNAME_name_from_acm> and <CNAME_value_from_acm> w/ the values from output of previous command) :
        ```
        {
            "Changes": [
                {
                    "Action": "UPSERT",
                    "ResourceRecordSet": {
                        "Name": <CNAME_name_from_acm> ,
                        "Type": "CNAME",
                        "TTL": 300,
                        "ResourceRecords": [{"Value": <CNAME_value_from_acm>}]
                    }
                }
            ]
        }
        ```

        3. Add the CNAME record to Route 53 (replace the `HOSTED_ZONE_ID` w/ value from step 3.1):
            ```
            aws route53 change-resource-record-sets --hosted-zone-id <HOSTED_ZONE_ID> --change-batch file://tmp/acm_validation_config.json
            ```

6. #### Verify ACM Certificate Validation Status
    After some time, verify that the ACM Certificate `Status` is `Issued`. Give it some time if it isn't.
    ```
    aws acm describe-certificate --certificate-arn <your-certificate-arn> --region us-east-1
    ```

7. #### Create CloudFront distribution
    1. Create an Origin Access Control and save it to `tmp/origin_access_control_config.json`
        ```
        {
            "Name": "air-remote-access-control",
            "Description": "OAC for AirRemote bucket",
            "SigningProtocol": "sigv4",
            "SigningBehavior": "always",
            "OriginAccessControlOriginType": "s3"
        }
        ```
    
    2. Publish it and retrieve the Id that is displayed in the response
        ```
        aws cloudfront create-origin-access-control --origin-access-control-config file://tmp/origin_access_control_config.json
        ```

    3. Create a caching policy and save it to `tmp/caching_policy.json`
        ```
        {
            "Name": "AirRemoteCustomCachePolicy",
            "DefaultTTL": 86400,
            "MinTTL": 0,
            "MaxTTL": 31536000,
            "ParametersInCacheKeyAndForwardedToOrigin": {
                "EnableAcceptEncodingGzip": true,
                "EnableAcceptEncodingBrotli": true,
                "HeadersConfig": {
                    "HeaderBehavior": "none"
                },
                "CookiesConfig": {
                    "CookieBehavior": "all"
                },
                "QueryStringsConfig": {
                    "QueryStringBehavior": "all"
                }
            }
        }
        ```

    4. Publish the cache policy and retrieve the Id in the response to use on the next step.
        ```
        aws cloudfront create-cache-policy --cache-policy-config file://tmp/caching_policy.json
        ```

    5. Create the distribution config and save it to `tmp/cloudfront_distribution_config.json`.
        ```
        {
            "CallerReference": "'CLOUDFRONT_AIRREMOTE_DISTRIBUTION'",
            "Comment": "Air Remote CloudFront Distribution",
            "Enabled": true,
            "Aliases": {
                "Quantity": 1,
                "Items": ["<your-domain>"]
            },
            "Origins": {
                "Quantity": 1,
                "Items": [
                {
                    "Id": "air-remote-origin",
                    "DomainName": "<your-domain>.s3.eu-central-1.amazonaws.com",
                    "OriginAccessControlId": <ORIGIN-ACCESS-CONTROL>,
                    "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                    }
                }
                ]
            },
            "DefaultCacheBehavior": {
                "TargetOriginId": "air-remote-origin",
                "ViewerProtocolPolicy": "redirect-to-https",
                "AllowedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
                },
                "CachePolicyId": <CACHE_POLICY_ID>
            },
            "ViewerCertificate": {
                "ACMCertificateArn": <ACM_CERTIFICATE_ARN>,
                "SSLSupportMethod": "sni-only",
                "MinimumProtocolVersion": "TLSv1.2_2021"
            },
            "Restrictions": {
                "GeoRestriction": {
                "RestrictionType": "none",
                "Quantity": 0
                }
            },
            "CustomErrorResponses": {
                "Quantity": 2,
                "Items": [
                    {
                    "ErrorCode": 403,
                    "ResponsePagePath": "/index.html",
                    "ResponseCode": "200",
                    "ErrorCachingMinTTL": 300
                    },
                    {
                    "ErrorCode": 404,
                    "ResponsePagePath": "/index.html",
                    "ResponseCode": "200",
                    "ErrorCachingMinTTL": 300
                    }
                ]
            },
            "HttpVersion": "http2",
            "IsIPV6Enabled": true,
            "DefaultRootObject": "index.html",
            "WebACLId": ""
        }
        ```

8. #### Create S3 bucket policy --- this needs change
    1. Create the following bucket policy in `tmp/bucket_policy.json` and replace w/ values from previous steps.
        ```
        {
            "Version": "2008-10-17",
            "Id": "PolicyForCloudFrontPrivateContent",
            "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::<your-domain>/*",
                "Condition": {
                    "StringEquals": {
                        "AWS:SourceArn": "<CLOUDFRONT_ARN>"
                    }
                }        
            }
            ]
        }
        ```

    2. Attach the policy to S3
        ```
        aws s3api put-bucket-policy --bucket <your-domain> --policy file://tmp/bucket_policy.json
        ```

9. #### Map Domain Name to Cloudfront distribution
    1. Get the Cloudfront distribution URL and Route 53 Hosted Zone Id through the following commands (present in `DomainName` / `Id` ):
        ```
        aws cloudfront list-distributions
        aws route53 list-hosted-zones
        ```

    2. Create a file `tmp/route_53_record.json` and paste the following:
        ```
        {
            "Comment": "A record for CloudFront distribution",
            "Changes": [
                {
                    "Action": "UPSERT",
                    "ResourceRecordSet": {
                        "Name": <your-domain>,
                        "Type": "A",
                        "AliasTarget": {
                            "HostedZoneId": "Z2FDTNDATAQYW2",
                            "DNSName": <CLOUDFRONT_DOMAIN_NAME>,
                            "EvaluateTargetHealth": false
                        }
                    }
                }
            ]
        }

        ```

    3. Apply the change through the CLI
        ```
        aws route53 change-resource-record-sets --hosted-zone-id "/hostedzone/Z0361408SYOSZ1L01O2" --change-batch file://tmp/route_53_record.json
        ```


    aws s3 website s3://your-bucket-name/ --index-document index.html --error-document index.html

---

## 📜 License
Licensed under the MIT License.
🔗 View License Details 

---

## 🤝 Contributing
Feel free to fork the repository and contribute! Pull requests and feedback are welcome.


---

## 🛠️ Support
For issues or questions, open an issue on GitHub.

