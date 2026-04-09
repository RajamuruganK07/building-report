# Deploy to Azure Container Instances

resource "azurerm_resource_group" "apartment_system" {
  name     = "apartment-system-rg"
  location = "East US"
}

# Container Registry
resource "azurerm_container_registry" "apartment_acr" {
  name                = "apartmentsystemacr"
  resource_group_name = azurerm_resource_group.apartment_system.name
  location            = azurerm_resource_group.apartment_system.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Container Instance for App
resource "azurerm_container_group" "apartment_app" {
  name                = "apartment-system-app"
  location            = azurerm_resource_group.apartment_system.location
  resource_group_name = azurerm_resource_group.apartment_system.name
  ip_address_type     = "Public"
  dns_name_label      = "apartment-system"
  os_type             = "Linux"

  container {
    name   = "apartment-app"
    image  = "${azurerm_container_registry.apartment_acr.login_server}/apartment-system:latest"
    cpu    = 1
    memory = 1.0

    environment_variables = {
      MONGODB_URI    = azurerm_cosmosdb_account.apartment_cosmos.connection_strings[0]
      REDIS_HOST     = azurerm_redis_cache.apartment_redis.hostname
      NODE_ENV       = "production"
    }

    ports {
      port     = 5000
      protocol = "TCP"
    }
  }

  image_registry_credential {
    server   = azurerm_container_registry.apartment_acr.login_server
    username = azurerm_container_registry.apartment_acr.admin_username
    password = azurerm_container_registry.apartment_acr.admin_password
  }
}

# Cosmos DB (MongoDB compatible)
resource "azurerm_cosmosdb_account" "apartment_cosmos" {
  name                = "apartment-system-cosmos"
  location            = azurerm_resource_group.apartment_system.location
  resource_group_name = azurerm_resource_group.apartment_system.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.apartment_system.location
    failover_priority = 0
  }
}

# Redis Cache
resource "azurerm_redis_cache" "apartment_redis" {
  name                = "apartment-redis"
  location            = azurerm_resource_group.apartment_system.location
  resource_group_name = azurerm_resource_group.apartment_system.name
  capacity            = 0
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
}

# Application Insights
resource "azurerm_application_insights" "apartment_insights" {
  name                = "apartment-insights"
  location            = azurerm_resource_group.apartment_system.location
  resource_group_name = azurerm_resource_group.apartment_system.name
  application_type    = "web"
}

# Outputs
output "app_url" {
  value = "http://${azurerm_container_group.apartment_app.fqdn}:${azurerm_container_group.apartment_app.container[0].ports[0].port}"
}

output "registry_url" {
  value = azurerm_container_registry.apartment_acr.login_server
}

output "cosmos_connection_string" {
  value     = azurerm_cosmosdb_account.apartment_cosmos.connection_strings[0]
  sensitive = true
}
