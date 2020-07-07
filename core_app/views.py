from django.shortcuts import render, redirect
from projects.models import Project
from projects.serializer import ProjectSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.template import loader
from .forms import ContactForm
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib import messages
from .models import Profile, FilePDF
from django.contrib.auth.models import User
from django.http import HttpResponse
from blog.models import Tag
from collections import OrderedDict


PAGINATION_OBJECTS_PER_PAGE = 3


def core_app_view(request):

    projects_as_dict = OrderedDict()

    tags = Tag.objects.all()

    for tag in tags:
        projects = Project.objects.filter(tags=tag).order_by('-date_posted')
        paginator = Paginator(projects, PAGINATION_OBJECTS_PER_PAGE)
        page = 1
        try:
            projects = paginator.page(page)
        except PageNotAnInteger:
            projects = paginator.page(2)
        except EmptyPage:
            projects = paginator.page(paginator.num_pages)

        projects_as_dict[tag] = projects
    print(projects_as_dict)
    # POST request can be:
    # (1) contact form sent
    # (2) Projects filtered by tags
    # (3) changing Projects pagination page
    if request.method == 'POST':
        # Get the completed form.
        form = ContactForm(request.POST)
        # If the completed form is valid, process content.
        if form.is_valid():
            # Save form content, and extract information.
            form.save()
            name = form.cleaned_data['name']
            subject = form.cleaned_data['subject']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            # Prepare incoming message to be sent to myself, convert it to an EmailMessage, and send email to myself.
            incoming_message = {
                "subject": subject + " from {0}, through Django".format(name),
                "body": message + "\n\nYou received this email from '{0}', email: {1}".format(name, email)
            }
            incoming_email = EmailMessage(
                subject=incoming_message["subject"],
                body=incoming_message["body"],
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER])
            #incoming_email.send(fail_silently=False)
            # Prepare thank you message to be sent to myself, convert it to an EmailMessage, and send email to myself.
            thank_you_message = {
                "subject": "Thank you for contacting me! (Mark Csizmadia)",
                "body": ("Dear {0},\n\nThank you for contacting me!\n\n"
                         "I hope you enjoyed browsing through my website. "
                         "I will get back to you within 24 hours!\n\n"
                         "Kind Regards,\nMark Csizmadia".format(name))
            }
            thank_you_email = EmailMessage(
                subject=thank_you_message["subject"],
                body=thank_you_message["body"],
                from_email=settings.EMAIL_HOST_USER,
                to=[email])
            #thank_you_email.send(fail_silently=False)
            # User feedback as message to confirm that they contacted me successfully via email.
            messages.success(request, f'Thank you for your message, {name}!')
            return redirect('core_app_view')
        else:
            pass

    # If not POST request, lean the form.
    else:
        form = ContactForm()

    # Build context for accessing data in HTML.
    context = {
        "title": "Portfolio Website",
        "form": form,
        "mark_profile": Profile.objects.get(user=User.objects.get(username="mark")),
        "cv_file_object": FilePDF.objects.get(identifier="cv"),
        "project_report_file_object": FilePDF.objects.get(identifier="project_report"),
        "internship_report_file_object": FilePDF.objects.get(identifier="internship_report"),
        "projects_as_dict": projects_as_dict
    }

    return render(request, 'core_app/base.html', context)


def projects_filter_view_lazy(request):
    print("executing projects_filter_view_lazy")
    page = request.POST.get('page')
    tag_slug = request.POST.get('tag_slug')
    print("tag_slug_ajax: {0}".format(tag_slug))
    t = Tag.objects.get(slug=tag_slug)
    projects = Project.objects.filter(tags=t).order_by('-date_posted')
    # use Django's pagination
    # https://docs.djangoproject.com/en/dev/topics/pagination/
    paginator = Paginator(projects, PAGINATION_OBJECTS_PER_PAGE)
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        projects = paginator.page(2)
    except EmptyPage:
        projects = paginator.page(paginator.num_pages)
    # build a html posts list with the paginated posts
    project_html = loader.render_to_string(
        'core_app/project.html',
        {'projects': projects}
    )
    print("project_html")
    # package output data and return it as a JSON object
    output_data = {
        'project_html': project_html,
        'has_next': projects.has_next()
    }
    return JsonResponse(output_data)


def download_pdf(request, pdf_file_identifier):
    file_object = FilePDF.objects.get(identifier=pdf_file_identifier)
    response = HttpResponse(file_object.pdf, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={0}'.format(file_object.title + ".pdf")
    return response

