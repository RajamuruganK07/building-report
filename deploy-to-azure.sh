#!/bin/bash

# Install Terraform
echo "Installing Terraform..."
if ! command -v terraform &> /dev/null; then
  # For Ubuntu/Debian
  curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
  sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
  sudo apt-get update && sudo apt-get install terraform
fi

# Initialize Terraform
echo "Initializing Terraform..."
cd infrastructure
terraform init

# Plan deployment
echo "Planning Terraform deployment..."
terraform plan -out=tfplan

# Apply
read -p "Do you want to deploy to Azure? (yes/no): " confirm
if [ "$confirm" = "yes" ]; then
  terraform apply tfplan
  echo "✅ Deployment complete!"
  terraform output app_url
else
  echo "Deployment cancelled."
fi
