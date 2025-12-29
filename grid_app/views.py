from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.models import User
from .models import *
from django.http import JsonResponse
from django.contrib.auth import authenticate, login,logout
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings



def Home(request):


    context={
        'is_logged_in': request.user.is_authenticated,
        'user': request.user,
        'testimonials': Testimonial.objects.filter(is_active=True),
        'projects':Project.objects.all()
    }
    return render(request,'grid.html',context)

@csrf_exempt
def SignupPage(request):
    if request.method=="POST":
        first_name=request.POST['signupName']
        username=request.POST['signupUsername']
        email=request.POST['signupEmail']
        password=request.POST['signupPassword']

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'success':False,
                'error':'Username Already Exists Try Again or Login'
            })
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'success':False,
                'error':'Email id Already Exists Try Again or Login'
            })
        
        new_user=User(username=username,first_name=first_name,email=email)
        new_user.set_password(password)
        new_user.save()

        return JsonResponse({
            'success':True
        })
    return JsonResponse({
        'success':False,
        'error':'Invalid Request'
    })


def check_username(request):
    username = request.GET.get("username", "")
    exists = User.objects.filter(username=username).exists()
    return JsonResponse({"exists": exists})


def check_email(request):
    email = request.GET.get("email", "")
    email=email.lower()
    exists = User.objects.filter(email=email).exists()
    return JsonResponse({"exists": exists})


@csrf_exempt
def LoginPage(request):
    if request.method == 'POST':
        identifier = request.POST.get('loginIdentifier')
        password = request.POST.get('loginPassword')

        if not identifier or not password:
            return JsonResponse({'success': False, 'error': 'Missing fields'})

        user = authenticate(username=identifier, password=password)

        if not user:
            try:
                email_user = User.objects.get(email=identifier)
                user = authenticate(username=email_user.username, password=password)
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Invalid credentials'})

        if not user:
            return JsonResponse({'success': False, 'error': 'Invalid credentials'})

        login(request, user)

        return JsonResponse({
            'success': True,
            'message': 'Login successful',
            'username': user.username,
            'name': user.first_name or user.username
        })

    return JsonResponse({'success': False, 'error': 'Invalid request'})


def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "username": request.user.username,
            "email": request.user.email,
        })
    else:
        return JsonResponse({"authenticated": False})

@csrf_exempt
def LogoutPage(request):
    if request.method=='POST':
        logout(request)  
        return JsonResponse({
            "success": True
            })
    
    return JsonResponse({
        "success": False, 
        "error": "Invalid request"
        })

@csrf_exempt
def ContactPage(request):
    if request.method=="POST":
        name=request.POST['name']
        email=request.POST['email']
        product_type=request.POST['product_type']
        message=request.POST['message']

        Contact.objects.create(name=name,email=email,product_type=product_type,message=message,created_at=timezone.now())

        send_mail(
            subject=f"New Contact From - {name}",
            message=f"""
            Name         : {name}
            Email        : {email}
            Product Type : {product_type}
            message      : {message}
            """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=["contact.griddezign@gmail.com"],  
            fail_silently=False,
        )
        return JsonResponse({
            'success':True,
            "message": "Message sent successfully!"
        })

    return JsonResponse({
        "error": "Invalid method"
        }, status=400)


def GetTestimonial(request):
    testimonials = list(Testimonial.objects.values(
        'id', 'name', 'position', 'message', 'rating', 'image'
    ))
    for t in testimonials:
        if t['image']:
            t['image'] = request.build_absolute_uri('/media/' + t['image'])
    return JsonResponse({'testimonials': testimonials})




@csrf_exempt
def save_opinion(request):  #4809-4827  4755-4774
    if request.method == "POST":
        project_id = request.POST.get("project_id")
        rating = request.POST.get("rating")
        message = request.POST.get("opinion_message")

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Invalid project id"}, status=400)
        
        Opinion.objects.create(
            project=project,
            text=message,
            rating=rating
        )

        return JsonResponse({"success": True})

    return JsonResponse({"error": "Invalid request"}, status=400)


def get_user_data(request):

    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "username": request.user.username,
            "is_superuser": request.user.is_superuser
        })

    return JsonResponse({"authenticated": False})

















