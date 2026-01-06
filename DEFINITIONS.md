# Look.sy Definitions

## Custom

Specific to a company or the request that was submitted. For example, a brand, like Coca-cola, would have custom fonts, logos and privacy Inputs, or values, specific to their company. Custom at Look.sy modifies or defines one or both of two variables - the Validation Set and the Input.

Custom is used in contrast to Standard. Where Standard might have a list of 5 appropriate fall back web fonts for readability, custom would specify one or two. A Custom Validation Set for a brand is a list specific that brand's QA or quality requirements and might exclude Validations in a Standard Set, and specify Validations that aren't included in the Standard Set. For example, Brand Color Validations won't exist in Standard but will likely exist in every Custom Validation Set.

## LKSY.org

The community "organization" that manages and publishes both QA Lists, or Validation Sets, and Standard Inputs, or Inputs. LKSY.org is the public, natural language location for these lists, values, references and discovery (SEO), and Github project /LKSY is where the versioning and the values are managed and accessed systematically.

## Input

The "correct" or specified value or variable for that specific Validation. For example, if the purpose of the Validation is testing to make sure the email is using the correct font, the Validation would specify the input to be "Times new Roman."

This value is not always required, for example, if the Validation is for unsubscribe link present, there doesn't need to be an input that says "unsubscribe is present." LKSY.org is where the list of Standard inputs exists and is modified.

## Standard

A community-managed and published set of Inputs and Validation Sets. Standards are published on LKSY.org and https://github.com/mhhlines/LKSY.

Standard is used in contrast to Custom. While great QA is going to be as specific as possible, we know that most people are lazy and AI is making them lazier. Standard is how we can objectively say what Validation Sets should be used, and what Inputs should be tested against without the user having to specify anything.

## Subject

The thing or target that is Validated. Currently, this is limited to URLs (a single webpage) and email (a single email).

## Validation

A single "function" that can be performed to QA or test something. A validation consists of a Validation Set that sets the Subject, a specific Input, and Validation Instructions that are specific to the Validation's function.

## Validation Set Template

The entire request that comes together as a single request in a versioned Validation Set. If Standard, these are the "Lists" on the LKSY.org site, and will lack most of the details in the request submission. If Custom, for example, a QA List required by Privacy Counsel, they would be just any Validation Set and be defined by the Validations requested in the submission. Templates, just like Validation Sets, each request is limited to a single Subject.

## Validation Instructions

A natural language description of how a person would manually perform the specific Validation with the defined Inputs. This is the "special sauce" of the commercial product and should not be shared externally nor in our api, or the LKSY.org community.

## URL

This is descriptive of the test subject. We specifically say URL or Webpage, not Landing Page or Website because those terms can carry incremental and confusing meaning.

## Webpage

See URL

---

## Version History

| Version | Date Changed | Description of Change | Author |
|---------|--------------|----------------------|--------|
| 1.0 | 2025-01-03 | MH proposed. Needs to be set in wiki or docs somewhere too. | MH |
| 1.0 | 2025-01-06 | Added Validation Set Template | MH |

