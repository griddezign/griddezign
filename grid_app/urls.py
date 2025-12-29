from django.urls import path
from .views import *

urlpatterns=[
    path('',Home),
    path('signup/',SignupPage,name='signup'),
    path("check_username/", check_username),
    path("check_email/", check_email),
    path('login/',LoginPage,name='login'),
    path('check_auth/',check_auth,name='check_auth'),
    path('logout/',LogoutPage,name='logout'),
    path('send_contact/',ContactPage,name='send_contact'),
    path('get-testimonial/', GetTestimonial, name='get_testimonial'),
    path('save_opinion/',save_opinion, name='save_opinion'),
    path("user/", get_user_data, name="user")
]