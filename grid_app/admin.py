from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'company', 'rating', 'is_active', 'created_at')
    list_filter = ('rating', 'is_active', 'created_at')
    search_fields = ('name', 'position', 'company', 'content')
    list_editable = ('rating', 'is_active')


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

class ProjectBulletInline(admin.TabularInline):
    model = ProjectBullet
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category")
    inlines = [ProjectImageInline, ProjectBulletInline]
