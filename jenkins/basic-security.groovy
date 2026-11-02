import jenkins.model.*
import hudson.security.*

def instance = Jenkins.getInstance()
def realm = new HudsonPrivateSecurityRealm(false)
def user = realm.createAccount("admin", "admin")
user.save()
instance.setSecurityRealm(realm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(true)
instance.setAuthorizationStrategy(strategy)

instance.save()
println("==> Successfully initialized admin:admin with anonymous read access!")
