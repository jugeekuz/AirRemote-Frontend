# AirRemote Frontend

🎉 Welcome to the **AirRemote Frontend**! 🎉

This is the web application that makes your remote-controlled devices smarter and easier to manage. With an intuitive interface, powerful automation tools, and sleek design, the frontend brings the AirRemote experience to life.

---

## 🌟 Project Overview

The **AirRemote** ecosystem bridges the gap between traditional remote-controlled devices and modern smart technology. The project is divided into three main components:

- **Embedded Device:** Captures, sends, and communicates IR signals.
- **Serverless Backend:** Handles commands and automations.
- **Frontend (This Repository):** Your gateway to control, automation, and smart device management.

### ✨ Features at a Glance

- 📱 **Device Management:** Organize and control all your remote-controlled devices from one place.
- 🔄 **IR Code Capture & Replay:** Save and replay IR signals effortlessly.
- 🤖 **Automations:** Create schedules and workflows for smarter living.
- 💻 **Modern Design:** Built with React.js and styled with Tailwind CSS for a sleek, responsive interface.
- 🌐 **Cross-Platform:** Works beautifully on desktop, tablet, and mobile.

---

## 🎨 Visual Preview

*Insert a stunning screenshot or demo GIF of the frontend here.*

---

## 🛠️ Built With

- **React.js:** The foundation of our dynamic user interface.
- **Tailwind CSS:** For a modern, utility-first design.
- **Axios:** Smooth communication with the backend.
- **React Router:** Seamless page transitions.
- **Vite:** Super-fast development and optimized builds.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/airremote-frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd airremote-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to explore the app.

---

## 🌍 Deployment

This app is ready to deploy on **AWS**. Below is a placeholder for your deployment guide:

### Deploying to AWS

### Step 1 - Create Bucket
```
aws s3api create-bucket --bucket <your-bucket-name> --region <your-region-id> --create-bucket-configuration LocationConstraint=<your-region-id>
```

### Step 2 - Upload your files
```
aws s3 sync ./dist s3://<your-bucket-name>
```

### Step 3 - Configure Route 53
    1. Create a Hosted Zone (Change `unique-string` to some unique value):

    ```
    aws route53 create-hosted-zone --name <hosted-zone-name> --caller-reference unique-string
    ```

    2. Retrieve the NameServers and update them in your domain registrar (verify that the name server change took place using a whois service).

### Step 4 - Request an SSL Certificate using AWS ACM
    1. Request a Certificate (region has to be `us-east-1`) and keep the CertificateArn output:
        ```
        aws acm request-certificate --domain-name <your-domain-name> --validation-method DNS --region us-east-1
        ```

### Step 5 - Create DNS validation records in Route 53
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

### Step 6 - Verify ACM Certificate Validation Status
After some time, verify that the ACM Certificate `Status` is `Issued`. Give it some time if it isn't.
```
aws acm describe-certificate --certificate-arn <your-certificate-arn> --region us-east-1
```

### Step 7 - Create CloudFront distribution
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

### Step 8 - Create S3 bucket policy --- this needs change
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

### Step 9 - Map Domain Name to Cloudfront distribution
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

## 📂 Folder Structure

```
airremote-frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # App pages (Dashboard, Remotes, Devices, Automations)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   ├── assets/           # Static files
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
├── public/               # Public assets
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
```

---

## 📸 Demo

*Add a demo video, interactive GIF, or link to a live version here.*

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your descriptive message here"
   ```
4. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request on GitHub.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## 📞 Contact Us

Got questions or feedback? Reach out to us:

- **Email:** your-email@example.com
- **GitHub Issues:** [AirRemote Issues](https://github.com/yourusername/airremote-frontend/issues)

---

Thank you for using **AirRemote**! Together, we’re making every device smarter and more accessible. 🚀
