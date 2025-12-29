from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('branding','Branding'),
        ('banner design','Banner Design'),
        ('visiting card','Visiting Card'),
        ('posters','Posters'),
        ('thumbnail','Thumbnail'),
        ('logo','Logo'),
        ('ui-ux','UI-UX'),
        ('others','Others'),
    ]

    title=models.CharField(max_length=250)
    company_name=models.CharField(max_length=250)
    category=models.CharField(max_length=50,choices=CATEGORY_CHOICES,default='others')
    description=models.CharField(max_length=255 , blank=True,null=True)
    paragraph=models.CharField(max_length=255,blank=True,null=True)
    bullet_head=models.CharField(max_length=255,null=True)
    final_quote=models.CharField(max_length=100,null=True)
    main_image=models.ImageField(upload_to='projects/',blank=True,null=True)

    def __str__(self):
        return self.company_name + " " + self.category
    
class ProjectImage(models.Model):
    project=models.ForeignKey(Project,related_name='images',on_delete=models.CASCADE)
    image=models.ImageField(upload_to='projects/',blank=True,null=True)
    
    def __str__(self):
        return f'Image for {self.project}'
    
class ProjectBullet(models.Model):
    project=models.ForeignKey(Project,related_name='bullets',on_delete=models.CASCADE)
    text=models.CharField(max_length=255)

    def __str__(self):
        return f'Bullets for {self.project}'


class Contact(models.Model):
    name=models.CharField(max_length=100)
    email=models.EmailField()
    product_type=models.CharField(max_length=100)
    message=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)




class Testimonial(models.Model):
    name = models.CharField(max_length=100,null=True)
    position = models.CharField(max_length=100,null=True)
    company = models.CharField(max_length=100,null=True)
    content = models.TextField()
    rating = models.IntegerField(default=5)  # 1-5 rating
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.position}"


class Opinion(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='opinions')
    rating = models.IntegerField(default=0)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Opinion on {self.project.title}"












