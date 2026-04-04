---
title: "How to connect to AWS OpenSearch or Elasticsearch clusters using python"
slug: connect-to-aws-opensearchelasticsearch-using-python
description: "Connect to an ES/OpenSearch cluster on AWS in Python using elasticsearch or opensearch-py."
pubDate: '2024-12-18'
heroImage: './c365a1f6-39aa-4b1d-a9b0-44bf22eae45d.png'
tags: ['python', 'aws', 'aws-opensearch']
---

Connecting to an OpenSearch (ES) service running in AWS using Python is painful. Most examples I find online either don't work or are outdated, leaving me constantly fixing the same issues. To save time and frustration, here’s a collection of working code snippets, up-to-date as of December 2024.

- [Connect using the opensearch-py library (OpenSearch + ElasticSearch)](#connect-using-the-opensearch-py-library-opensearch--elasticsearch)
- [Connect using the elasticsearch library (ElasticSearch only)](#connect-using-the-elasticsearch-library-elasticsearch-only)
   * [elasticsearch &gt;= 8](#elasticsearch--8)
   * [elasticsearch &lt; 8](#elasticsearch--8-1)


## Connect using the opensearch-py library (OpenSearch + ElasticSearch)

This is my preferred way of connecting to an ES instance managed by AWS. It works for both ElasticSearch and OpenSearch clusters, and the authentication can take advantage of AWS profiles.

Install `opensearch-py` and `boto3` (for authentication):

```bash
pip install opensearch-py boto3
```

At the time of writing, this installs `opensearch-py==2.8.0` and `boto3==1.35.81`.

Now, you can create a client using the following:

```python
import boto3

from opensearchpy import (
    AWSV4SignerAuth,
    OpenSearch,
    RequestsHttpConnection,
)

es_host = "search-my-aws-esdomain-5k2baneoyj4vywjseocultv2au.eu-central-1.es.amazonaws.com"
aws_access_key = "AKIAXCUEGTAF3CV7GYKA"
aws_secret_key = "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"
region = "eu-central-1"

# Note: you can also use boto3.Session(profile_name="my-profile") or other ways
session = boto3.Session(
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=region,
)

client = OpenSearch(
    hosts=[{"host": es_host, "port": 443}],
    http_auth=AWSV4SignerAuth(session.get_credentials(), region, "es"),
    connection_class=RequestsHttpConnection,
    use_ssl=True,
)
```

Note that `boto3.Session` supports various ways of creating a session: using a profile, environment variables, and more. I will let you check it out!

Once you have it, check the connection using:

```python
client.ping() # should return True
client.info() # use this to get a proper error message if ping fails
```

To check indices:

```python
# List all indices
client.cat.indices()
client.indices.get("*")

# Check the existence of an indice
client.indices.exists("my-index")
```

## Connect using the elasticsearch library (ElasticSearch only)

⚠ 🔥 ⚠ This only works for ElasticSearch clusters! Connecting to an OpenSearch cluster raises

> UnsupportedProductError: The client noticed that the server is not Elasticsearch and we do not support this unknown product

### elasticsearch &gt;= 8

> [!note]
> Most snippets are still referencing `RequestsHttpConnection` (see next section), a class that was removed in `elasticsearch` 8.X. If you were googling for the error `cannot import name 'RequestsHttpConnection' from 'elasticsearch'`, you are at the right place!

Install `elasticsearch` (this should install `elastic-transport` as well), and `requests_aws4auth` . The latter, based on `requests`, is required to handle authentication to AWS:

```bash
pip install "elasticsearch>=8" requests_aws4auth
```

At the time of writing, this installs `elastic-transport==8.15.1`, `elasticsearch==8.17.0` and `requests-aws4auth==1.3.1`.

Now, you can create a client using the following:

```python
from elastic_transport import RequestsHttpNode
from elasticsearch import Elasticsearch
from requests_aws4auth import AWS4Auth

es_endpoint = "search-my-aws-esdomain-5k2baneoyj4vywjseocultv2au.eu-central-1.es.amazonaws.com"
aws_access_key = "AKIAXCUEGTAF3CV7GYKA"
aws_secret_key = "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"
region = "eu-central-1"

es = Elasticsearch(
    f"https://{es_host}",
    http_auth=AWS4Auth(
        aws_access_key, 
        aws_secret_key, 
        region,
        "es",
    ),
    verify_certs=True,
    node_class=RequestsHttpNode,
)
```

Once you have it, check the connection using:

```python
es.ping() # should return True
es.info() # use this to get a proper error message if ping fails
```

### elasticsearch &lt; 8

If you are still on an old version of elasticsearch:

```python
pip install "elasticsearch<8" requests_aws4auth
```

Currently `elasticsearch==7.17.12`, `requests-aws4auth==1.3.1`.

Now, you can create a client using the following:

```python
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

es_endpoint = "search-my-aws-esdomain-5k2baneoyj4vywjseocultv2au.eu-central-1.es.amazonaws.com"
aws_access_key = "AKIAXCUEGTAF3CV7GYKA"
aws_secret_key = "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"
region = "eu-central-1"

es = Elasticsearch(
    host=es_endpoint,
    http_auth=AWS4Auth(
        aws_access_key, aws_secret_key, region, "es"
    ),
    use_ssl=True,
    port=443,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
)
```

Check the connection:

```python
es.ping() # should return True
es.info() # use this to get a proper error message if ping fails
```
