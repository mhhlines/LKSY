# Install Google Cloud SDK

You need to install the Google Cloud SDK to deploy. Here are the options:

## Option 1: Install via Homebrew (Recommended for macOS)

```bash
brew install --cask google-cloud-sdk
```

Then initialize:
```bash
gcloud init
```

## Option 2: Install via Official Installer

1. Download from: https://cloud.google.com/sdk/docs/install
2. Run the installer
3. Follow the setup instructions

## Option 3: Quick Install Script

```bash
# Download and run the install script
curl https://sdk.cloud.google.com | bash

# Restart your shell or run:
exec -l $SHELL

# Initialize
gcloud init
```

## After Installation

1. **Authenticate:**
   ```bash
   gcloud auth login
   ```

2. **Set your project:**
   ```bash
   gcloud config set project visual-validation
   ```

3. **Verify:**
   ```bash
   gcloud config get-value project
   # Should output: visual-validation
   ```

4. **Then deploy:**
   ```bash
   ./deploy.sh
   ```

## Verify Installation

```bash
gcloud --version
```

You should see the gcloud CLI version information.


