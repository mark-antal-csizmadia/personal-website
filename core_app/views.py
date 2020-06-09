from django.shortcuts import render, redirect
from projects.models import Project
from projects.serializer import ProjectSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from .forms import ContactForm
from django.core.mail import EmailMessage, mail_admins
from django.http import HttpResponse
from django.conf import settings
from django.contrib import messages
from .models import Profile, FilePDF
from django.contrib.auth.models import User
from django.http import HttpResponse
from wsgiref.util import FileWrapper

# Create your views here.


def core_app_view(request):
    projects = Project.objects.all()
    number_of_projects_on_page = 3
    paginator = Paginator(projects, number_of_projects_on_page)
    first_page = paginator.page(1)
    first_page_object_list = paginator.page(1).object_list
    page_range = paginator.page_range
    page_n = 1

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            name = form.cleaned_data['name']
            subject = form.cleaned_data['subject']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
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
            messages.success(request, f'Thank you for your message, {name}!')
            return redirect('core_app_view')
        else:
            topic = request.POST.get('topic', None)
            page_n = request.POST.get('page_n', None)

            if topic == "all":
                projects = Project.objects.all()
            else:
                projects = Project.objects.filter(tag=topic)
            number_of_projects_on_page = 3
            paginator = Paginator(projects, number_of_projects_on_page)
            if paginator.page(page_n).has_next():
                next_page_n = paginator.page(page_n).next_page_number()
            else:
                next_page_n = page_n
            if paginator.page(page_n).has_previous():
                previous_page_n = paginator.page(page_n).previous_page_number()
            else:
                previous_page_n = page_n

            print("TOPIC {0}, page_n {1} / {2}".format(topic, page_n, paginator.num_pages))


        # article json
        serializer = ProjectSerializer(paginator.page(page_n).object_list, many=True)  # sending as json
        data = {"serializer": serializer.data, "page_n": page_n, "num_pages":paginator.num_pages,
                "next_page_n": next_page_n, "previous_page_n": previous_page_n}
        return JsonResponse(data, safe=False)
    else:
        form = ContactForm()

    context = {
        "title": "Mark Csizmadia | Personal Website",
        "paginator": paginator,
        "first_page": first_page,
        "first_page_object_list": first_page_object_list,
        "page_range": page_range,
        "page_n": 1,
        "form": form,
        "mark_profile": Profile.objects.get(user=User.objects.get(username="mark")),
        "cv_file_object": FilePDF.objects.get(identifier="cv"),
        "project_report_file_object": FilePDF.objects.get(identifier="project_report"),
        "internship_report_file_object": FilePDF.objects.get(identifier="internship_report"),
    }

    return render(request, 'core_app/base.html', context)


def download_pdf(request, pdf_file_identifier):
    file_object = FilePDF.objects.get(identifier=pdf_file_identifier)
    response = HttpResponse(file_object.pdf, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={0}'.format(file_object.title + ".pdf")
    return response

