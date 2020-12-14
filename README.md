## $5 Tech Unlocked 2021!
[Buy and download this Book for only $5 on PacktPub.com](https://www.packtpub.com/product/cloud-native-development-patterns-and-best-practices/9781788473927)
-----
*If you have read this book, please leave a review on [Amazon.com](https://www.amazon.com/gp/product/1788473922).     Potential readers can then use your unbiased opinion to help them make purchase decisions. Thank you. The $5 campaign         runs from __December 15th 2020__ to __January 13th 2021.__*

# Cloud Native Development Patterns and Best Practices
This is the code repository for [Cloud Native Development Patterns and Best Practices](https://www.packtpub.com/application-development/cloud-native-development-patterns-and-best-practices?utm_source=github&utm_medium=repository&utm_campaign=9781788473927), published by [Packt](https://www.packtpub.com/?utm_source=github). It contains all the supporting project files necessary to work through the book from start to finish.
## About the Book
Cloud-native is a modern approach to building systems that leverages the benefits of the cloud. With cloud-native development, teams can build applications faster than ever before. This book focuses on architectural patterns for building highly scalable, cloud-native systems. You will learn how the combination of the cloud, reactive principles, and automation enables teams to continuously deliver innovation with confidence.
You'll begin by learning the core concepts that make these systems unique and how their anatomy makes them responsive, resilient, and elastics. You will explore foundational patterns that turn the database inside out to achieve massive scale with cloud-native databases. You will also learn how to continuously deliver with confidence by shifting deployments and testing all the way to the left and implementing continuous observability in production. But there's more – you will also learn how to strangle you monolith and design an evolving cloud-native system.
By the end of the book you will have the ability to create modern cloud-native systems.
## Instructions and Navigation
All of the code is organized into folders. Each folder starts with a number followed by the application name. For example, Chapter02.

Chapters 1, 2, 8, 9, and 10 do not have code files.

The code will look like the following:
```
 increment() {
    const val = this.state.count + 1;
    this.dataset.put('count', String(val), (err, record) => {
      this.setState({
        count: val
      });
    });
  }
```

Cloud experience is not a prerequisite for this book, but experienced readers will find the content readily applicable. The examples used in this book require an AWS account. You can sign up for a free trial account via the AWS website (https://aws.amazon.com/free). The examples are written in NodeJS (https://nodejs.org) and leverage the Serverless Framework (https://serverless.com/framework). The README file in the code bundle contains installation instructions. The examples leverage the powerful HighlandJS (http://highlandjs.org) streaming library.

## Related Products
* [Cloud Development and Deployment with CloudBees](https://www.packtpub.com/virtualization-and-cloud/cloud-development-and-deployment-cloudbees?utm_source=github&utm_medium=repository&utm_campaign=9781783281633)

* [Cloud Native Development Cookbook](https://www.packtpub.com/application-development/cloud-native-development-cookbook?utm_source=github&utm_medium=repository&utm_campaign=9781788470414)

* [Cloud Native Architectures](https://www.packtpub.com/application-development/cloud-native-architectures?utm_source=github&utm_medium=repository&utm_campaign=9781787280540)
